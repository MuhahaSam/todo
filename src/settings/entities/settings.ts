import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class Settings {
    @IsString()
    access: string

    @IsString()
    refresh: string
}