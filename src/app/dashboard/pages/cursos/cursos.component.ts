import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmCursosComponent } from './abm-cursos/abm-cursos.component';
import { MatDialog } from '@angular/material/dialog';
import { CursosService } from 'src/app/dashboard/pages/cursos/services/cursos.service';
import { Curso } from './models';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns: string[] = ['id', 'nombre', 'fecha_inicio', 'fecha_fin', 'opciones'];


  cursosSuscription: Subscription | null = null;

  constructor(
    private matDialog: MatDialog,
    private cursosService: CursosService,
    private datePipe: DatePipe
  ) {
    this.sort = new MatSort();
  }


  ngOnInit(): void {
    this.cursosSuscription = this.cursosService.obtenerCursos().subscribe({
      next: (cursos) => {
        this.dataSource.data = cursos;
      },
    });
  }

  ngOnDestroy(): void {
    this.cursosSuscription?.unsubscribe();
  
  }
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement).value;
    this.dataSource.filter = inputValue.trim().toLowerCase();
  }

  abrirABMCursos(): void {
    const dialog = this.matDialog.open(AbmCursosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursos = this.dataSource.data;
        const nuevoCurso: Curso = {
          ...valor,
          id: cursos.length + 1,
        };
        this.cursosService.addCourse(nuevoCurso);
      }
    });
  }

  editarCurso(row: Curso): void {
    const dialog = this.matDialog.open(AbmCursosComponent, {
      data: { curso: row },
    });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursoActualizado = {
          ...valor,
          // fecha_nacimiento: this.datePipe.transform(valor.fecha_nacimiento, 'dd/MM/yyyy'),
          id: row.id,
        };
        this.cursosService.updateCourse(cursoActualizado);
      }
    });
  }

  eliminarCurso(id: number): void {
    this.cursosService.deleteCourse(id);
  }
}
