import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';


@Component({
  selector: 'app-top-filmes',
  templateUrl: './top-filmes.component.html',
  styleUrls: ['./top-filmes.component.css']
})
export class TopFilmesComponent {
  filmes: any[] = [];


  constructor(private movieService: MovieService) {}


  ngOniNit() {
    this.movieService.getTopFilmes().subscribe((filmes: any[]) => {
      this.filmes = filmes.slice(0,10);
    });
}

    curtirFilme(filme: any) {
      filme.curtidas++;
    }
}
