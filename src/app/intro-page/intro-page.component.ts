import { Component, OnInit } from '@angular/core';
import { NewsService, NewsArticle } from '../news.service';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrl: './intro-page.component.css'
})
export class IntroPageComponent {
  articles: NewsArticle[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }


  loadNews(): void {
    this.newsService.getNews().subscribe((data) => {
      this.articles = data;
    });
  }

}
