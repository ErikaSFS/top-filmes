import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private baseurl = 'https://api.themoviedb.org/3';
  private apikey = 'b92f18797984b3cbe3cb053ff0fbc657';
  //TopMovies!: TopMovies;

  constructor(private http: HttpClient) { }


  //top filmes

    topMoviesApiData():Observable<any> {
      return this.http.get(`${this.baseurl}/movie/top_rated?api_key=${this.apikey}`);
  
    }





}
