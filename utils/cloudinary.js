const cloudinary = require("../configs/cloudinary");

const deleteCloudinaryFile = async (fileUrl) => {
  if (!fileUrl) {
    return { success: false, message: "Không có URL để xóa" };
  }

  try {
    let resourceType = "image";
    if (fileUrl.includes("/video/upload/")) {
      resourceType = "video";
    } else if (fileUrl.includes("/raw/upload/")) {
      resourceType = "raw";
    } else if (fileUrl.includes("/image/upload/")) {
      resourceType = "image";
    }

    const uploadIndex = fileUrl.indexOf("/upload/");
    if (uploadIndex === -1) {
      return {
        success: false,
        message: "URL không hợp lệ - không tìm thấy '/upload/'",
      };
    }

    let pathAfterUpload = fileUrl.substring(uploadIndex + 8);
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
    pathAfterUpload = pathAfterUpload.split("?")[0].split("#")[0];
    let publicId;
    if (resourceType === "raw") {
      publicId = pathAfterUpload;
    } else {
      publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result === "ok") {
      return {
        success: true,
        message: "Đã xóa file thành công",
        result: result.result,
        resourceType: resourceType,
        publicId: publicId,
      };
    }

    if (result.result === "not found") {
      const alternativeTypes = ["image", "raw", "video"].filter(
        (type) => type !== resourceType
      );

      for (const altType of alternativeTypes) {
        const altResult = await cloudinary.uploader.destroy(publicId, {
          resource_type: altType,
          invalidate: true,
        });

        if (altResult.result === "ok") {
          return {
            success: true,
            message: `Đã xóa file thành công (resource_type: ${altType})`,
            result: altResult.result,
            resourceType: altType,
            publicId: publicId,
          };
        }
      }
      return {
        success: false,
        message: "File không tồn tại trên Cloudinary hoặc đã bị xóa",
        result: "not_found",
        publicId: publicId,
        triedResourceTypes: [resourceType, ...alternativeTypes],
      };
    }
    return {
      success: false,
      message: `Không thể xóa file (Cloudinary trả về: ${result.result})`,
      result: result.result,
      publicId: publicId,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi khi xóa file: ${error.message}`,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
};

module.exports = {
  deleteCloudinaryFile,
};
