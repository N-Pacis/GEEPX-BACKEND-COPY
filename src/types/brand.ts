import { Document } from "mongoose";

export interface IBrand extends Document{
    name: string
    logo: string
    description: string
    countryOrigin: string
    status: string
    categories: string[]
}