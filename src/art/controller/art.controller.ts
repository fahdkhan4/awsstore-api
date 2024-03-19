import { Request, Response } from "express";
import { ArtService } from "../service/art.service";
import { FilterQuery } from "mongoose";
import { ArtDocument } from "../model/art.model";

const artService = new ArtService();

export const createArt = async (req: Request, res: Response) => {
  const { authorId, categoryId, ...artData } = req.body;

  const newArt = await artService.createArt(authorId, categoryId, artData);

  res.status(201).json(newArt);
};

export const getArt = async (req: Request, res: Response) => {
  const { id } = req.params;

  const art = await artService.getArtById(id);

  res.status(200).json(art);
};

export const getArts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, ...query } = req.query;
  let id;
  if (query.id) id = query._id;

  const queryParams: FilterQuery<ArtDocument> = {};

  Object.keys(query).forEach((key) => {
    queryParams[key] = query[key];
  });

  const arts = await artService.getArts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    query: queryParams,
  });

  res.status(200).json(arts);
};

export const updateArt = async (req: Request, res: Response) => {
  const { id: artId } = req.params;
  const { ...updateData } = req.body;

  const updatedArt = await artService.updateArtById(artId, updateData);

  res.status(200).json(updatedArt);
};

export const deleteArt = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedArt = await artService.deleteArtById(id);
  res.status(200).json(deletedArt);
};
