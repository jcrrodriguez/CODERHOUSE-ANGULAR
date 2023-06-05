import { Pipe, PipeTransform } from '@angular/core';
import { Estudiante } from '../../dashboard/pages/alumnos/models/index';

@Pipe({
  name: 'nombreCompleto'
})
export class NombreCompletoPipe implements PipeTransform {

  transform(value: Estudiante, ...args: unknown[]): unknown {
    const newValue = `${value.nombre} ${value.apellido}`;
    switch (args[0]) {
      case 'mayuscula':
        return newValue.toUpperCase();
      case 'minuscula':
        return newValue.toLowerCase();
      default:
        return newValue;
    }
  }

}