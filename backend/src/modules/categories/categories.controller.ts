import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { Roles, Public } from '../../decorators';
import { Role } from '../../common/enums';
import { ApiResponse } from '../../common/responses';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() dto: CreateCategoryDto): Promise<ApiResponse<unknown>> {
    const category = await this.categoriesService.create(dto);
    return ApiResponse.ok('Category created', category);
  }

  @Public()
  @Get()
  async findAll(): Promise<ApiResponse<unknown>> {
    const categories = await this.categoriesService.findAll();
    return ApiResponse.ok('Categories retrieved', categories);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const category = await this.categoriesService.findOne(id);
    return ApiResponse.ok('Category retrieved', category);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: CreateCategoryDto,
  ): Promise<ApiResponse<unknown>> {
    const category = await this.categoriesService.update(id, dto);
    return ApiResponse.ok('Category updated', category);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
