import { Request, Response } from "express";
import { uploadDocument } from "../../helpers/document.helper";

export const uploadDocumentController = async (req: Request, res: Response) => {
  const uploadedFiles = await uploadDocument(req);

  const linkArray = uploadedFiles.map((file) => file.downloadURL);

  res.status(200).json({
    message: "Files uploaded successfully",
    data: uploadedFiles,
    downloadURLs: linkArray,
  });
};
