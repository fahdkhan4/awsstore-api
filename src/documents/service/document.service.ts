import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";

export async function uploadToFirebase(
  storage: any,
  file: Express.Multer.File,
  folderName: string,
  authorId: string,
  bookName: string
): Promise<string> {
  const { originalname, buffer } = file;
  const storageRef = ref(
    storage,
    `${folderName}/${authorId}/${bookName}/${originalname}`
  );
  await uploadBytes(storageRef, buffer);

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

export async function updateFirebaseFile(
  storage: any,
  file: Express.Multer.File,
  folderName: string,
  authorId: string,
  bookName: string
): Promise<string> {
  const { originalname, buffer } = file;
  const storageRef = ref(
    storage,
    `${folderName}/${authorId}/${bookName}/${originalname}`
  );

  await uploadBytesResumable(storageRef, buffer);

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

export async function deleteFirebaseFile(
  storage: any,
  folderName: string,
  authorId: string,
  bookName: string,
  fileName: string
): Promise<void> {
  const storageRef = ref(
    storage,
    `${folderName}/${authorId}/${bookName}/${fileName}`
  );

  await deleteObject(storageRef);
}
