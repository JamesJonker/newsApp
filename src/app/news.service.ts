import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  publishedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/news';  // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>(this.apiUrl);
  }

  getNewsById(id: number): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/${id}`);
  }

  createNews(article: NewsArticle): Observable<NewsArticle> {
    return this.http.post<NewsArticle>(this.apiUrl, article);
  }

  updateNews(id: number, article: NewsArticle): Observable<NewsArticle> {
    return this.http.put<NewsArticle>(`${this.apiUrl}/${id}`, article);
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}