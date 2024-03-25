export interface TransportOptions {
  service: string;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface TransportBookCreation {
  email: string;
  bookTitle: string;
  state: string;
}

export interface TransportCategoryCreation {
  categoryTitle: string;
  tags?: string[];
  description?: string;
  state: string;
}
