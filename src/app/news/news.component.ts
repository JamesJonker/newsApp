import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NewsService, NewsArticle } from '../news.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Output() messageEventNews = new EventEmitter<string>();

  articles: NewsArticle[] = [];
  // updatearticle: NewsArticle[] = [];
  selectedArticle: NewsArticle | null = null;
  isEditing: boolean = false;
  createNew: boolean = false;
  addArticle: boolean = false;
  readArticle : boolean = false;
  

  article = {
    title: '',
    description: '',
    content: ''
  };

  updatearticle = {
    title: '',
    description: '',
    content: ''
  };

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }


  loadNews(): void {
    this.newsService.getNews().subscribe((data) => {
      this.articles = data;
    });
  }


  addNewArticle(): void {
    this.addArticle = true;

  }

  // selectArticle(article: NewsArticle): void {
  //   this.selectedArticle = { ...article };
  //   this.isEditing = true;
  // }

  updateArticle(updatearticle: any): void {

    // this.article = this.selectedArticle;
    this.selectedArticle = updatearticle;
    // console.log('newTitle', newTitle);

    console.log('new info', this.selectedArticle);

    if (this.selectedArticle) {
      this.newsService.updateNews(this.selectedArticle.id, this.selectedArticle)
        .subscribe((updatedArticle) => {
          const index = this.articles.findIndex(a => a.id === updatedArticle.id);
          if (index !== -1) {
            this.articles[index] = updatedArticle;
          }
          this.isEditing = false;
          this.selectedArticle = null;
          this.isEditing = false;
          this.createNew = false;
          this.addArticle = false;
          this.readArticle = false;
          this.loadNews();
        });
    }
  }

  removeArticle(id: number): void {
    console.log("Article",id);
    this.newsService.deleteNews(id).subscribe(() => {
      this.articles = this.articles.filter(a => a.id !== id);
    });
  }
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedArticle = null;
  }

  // cancelAdd(){
  //   this.createNew = false;
  // }

  logout(){
    this.isEditing = false;
    this.createNew = false;
    this.addArticle = false;
    this.readArticle = false;

    this.messageEventNews.emit('LogOut');
    
  }

  readMore(article: any) {

    console.log('Read More clicked for', article);
    this.updatearticle = article;
    console.log("this.updatearticle", this.updatearticle)
    this.selectedArticle = article;
    console.log("selected articles",this.selectedArticle?.title)
    this.readArticle = true;
  }


  onSubmit() {
    const newArticle: NewsArticle = {
      id: 0, 
      title: this.article.title, 
      description: this.article.description,
      content: this.article.content,  
      publishedAt: new Date()
    };

    console.log(newArticle);

    this.newsService.createNews(newArticle).subscribe((article) => {
      console.log("subscripsion",article)
     // this.articles.push(article);
      this.loadNews();
    });
    this.addArticle = false;

  }
  CancelAdd(){
    this.addArticle = false;
  }

  readfull(){
    this.readArticle = true;
  }
  editArticle(){
    this.isEditing = true;
  }
}