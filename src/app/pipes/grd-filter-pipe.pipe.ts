import { formatDate } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterPipe",
})
export class GrdFilterPipePipe implements PipeTransform {
  transform(items: any[], valor: string): any[] {
    if (!items) return [];
    if (!valor) return items;

    const normalizeString = (str: string) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const normalizedValor = normalizeString(valor);

    return items.filter((item) => {
      for (let campo in item) {
        if (item[campo] != null && item[campo] != undefined) {
          let fieldValue = item[campo].toString();


          //primero validamos si no es fecha
          const regexISODate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
          const match = fieldValue.match(regexISODate);

          if (match) {

            // Intentamos convertir la cadena en una fecha
            const date = new Date(fieldValue);
            if (!isNaN(date.getTime())) {
              // Verifica si es una fecha válida
              fieldValue = formatDate(date, "dd/MM/yyyy", "en-US");
            }
          }
          const normalizedItemField = normalizeString(fieldValue);
          if (normalizedItemField.includes(normalizedValor)) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
