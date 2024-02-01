import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
