import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto';
import { generateSlug } from '../../common/helpers';
import type { Category } from '../../../generated/prisma/client.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findByName(dto.name);
    if (existing) throw new ConflictException('Category with this name already exists');

    const slug = generateSlug(dto.name);
    return this.categoriesRepository.create({ name: dto.name, slug, description: dto.description });
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    const slug = generateSlug(dto.name);
    return this.categoriesRepository.update(id, { name: dto.name, slug, description: dto.description });
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    await this.categoriesRepository.delete(id);
  }
}
