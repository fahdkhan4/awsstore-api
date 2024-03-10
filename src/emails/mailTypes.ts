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
