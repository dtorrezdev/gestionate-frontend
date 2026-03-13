import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `<p>ProductoBase works!</p>`
})
export class ProductoBase { }

@Component({
  standalone: true,
  template: `<p>ProductoPresentacion works!</p>`
})
export class ProductoPresentacion { }

@Component({
  standalone: true,
  template: `<p>Marca works!</p>`
})
export class Marca { }

@Component({
  standalone: true,
  template: `<p>UnidadMedida works!</p>`
})
export class UnidadMedida { }
