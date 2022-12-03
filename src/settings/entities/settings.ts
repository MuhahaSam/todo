import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class Settings {
    @IsInt()
    port: number

    @IsString()
    hostname: string

    @IsString()
    access: string

    @IsString()
    refresh: string
}