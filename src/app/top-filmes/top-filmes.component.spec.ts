import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFilmesComponent } from './top-filmes.component';

describe('TopFilmesComponent', () => {
  let component: TopFilmesComponent;
  let fixture: ComponentFixture<TopFilmesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFilmesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopFilmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
