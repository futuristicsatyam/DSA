import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { SearchQueryDto } from "./dto/search-query.dto";
import { ContentService } from "./content.service";

@ApiTags("Content")
@Public()
@Controller("api/v1/content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("dsa/subjects")
  getDsaSubjects() {
    return this.contentService.getSubjects("DSA");
  }

  @Get("dsa/topics/:slug")
  getDsaTopic(@Param("slug") slug: string) {
    return this.contentService.getTopicBySlug(slug, "DSA");
  }

  @Get("cp/subjects")
  getCpSubjects() {
    return this.contentService.getSubjects("CP");
  }

  @Get("cp/topics/:slug")
  getCpTopic(@Param("slug") slug: string) {
    return this.contentService.getTopicBySlug(slug, "CP");
  }

  @Get("gate/subjects")
  getGateSubjects() {
    return this.contentService.getSubjects("GATE");
  }

  @Get("gate/topics/:slug")
  getGateTopic(@Param("slug") slug: string) {
    return this.contentService.getTopicBySlug(slug, "GATE");
  }

  @Get("editorials/:slug")
  getEditorial(@Param("slug") slug: string) {
    return this.contentService.getEditorialBySlug(slug);
  }

  @Get("search")
  search(@Query() query: SearchQueryDto) {
    return this.contentService.search(query.q);
  }
}
