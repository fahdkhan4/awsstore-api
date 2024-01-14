import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { giveCurrentDateTime } from "./getCurrentDate";

const currentDate: string = giveCurrentDateTime();

export const uploadDocument = async (req: any) => {
  const uploadedFiles = [];
  const storage = req.firebaseStorage;

  for (const file of req.files) {
    const storageRef = ref(
      storage,
      `/${file.originalname + " " + currentDate}`
    );

    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    uploadedFiles.push({
      name: file.originalname,
      type: file.mimetype,
      downloadURL: downloadURL,
    });
  }

  return uploadedFiles;
};
