import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `<p>Stock works!</p>`
})
export class Stock { }

@Component({
  standalone: true,
  template: `<p>Reception works!</p>`
})
export class Reception { }

@Component({
  standalone: true,
  template: `<p>Otros works!</p>`
})
export class Otros { }

@Component({
    standalone: true,
    template: `<p>UbicacionStock works!</p>`
})
export class UbicacionStock { }

@Component({
    standalone: true,
    template: `<p>Kardex works!</p>`
})
export class Kardex { }
