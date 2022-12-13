import {Request} from "express";

export type AppRequest = Request & { randomNumberFromInterceptor: number };