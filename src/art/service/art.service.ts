import mongoose, { FilterQuery, Query } from "mongoose";
import { ArtDocument, ArtModel } from "../model/art.model";
import { AuthModel } from "../../auth/model/auth.model";
import { CategoryModel } from "../../categories/model/category.model";

interface ArtQueryParams {
  page: number;
  limit: number;
  query: FilterQuery<ArtDocument>;
}

export class ArtService {
  //get arts (with pagination )
  getArts = async ({
    page,
    limit,
    query,
  }: ArtQueryParams): Promise<ArtDocument[]> => {
    const arts = await ArtModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return arts;
  };

  //get an art by ID
  getArtById = async (artId: string): Promise<ArtDocument> => {
    const art = await ArtModel.findById(artId)
      .populate({
        path: "author",
        select: "-updatedAt",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .exec();

    if (!art) throw new Error("Art not found");

    return art;
  };

  //create an art
  createArt = async (
    authorId: string,
    categoryId: string,
    artData: Partial<ArtDocument>
  ): Promise<ArtDocument> => {
    if (
      !mongoose.Types.ObjectId.isValid(authorId) ||
      !mongoose.Types.ObjectId.isValid(categoryId)
    )
      throw new Error("Invalid authorId or genreId");

    console.log(artData);
    // Check if the corresponding documents (author and genre) exist
    const [author, category] = await Promise.all([
      AuthModel.findById(authorId),
      CategoryModel.findById(categoryId),
    ]);

    if (!author || !category) throw new Error("Author or genre not found");

    if (author.accountType === "user")
      throw new Error("Invalid authorId, only authors can create book");

    const artWithReferences = {
      ...artData,
      author: author._id,
      category: category._id,
      status: "published",
    };

    const art = await ArtModel.create(artWithReferences);

    return art;
  };

  //update an art
  updateArtById = async (
    artId: string,
    updateData: Partial<ArtDocument>
  ): Promise<ArtDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(artId))
      throw new Error("Invalid bookId, ");

    const updateDataWithReferences = { ...updateData };

    const updatedArt = await ArtModel.findByIdAndUpdate(
      artId,
      updateDataWithReferences,
      { new: true }
    ).populate("author category");

    return updatedArt;
  };

  //delete an art
  deleteArtById = async (artId: string): Promise<boolean> => {
    const deletedArt = await ArtModel.findByIdAndDelete(artId);

    return !!deletedArt;
  };
}
