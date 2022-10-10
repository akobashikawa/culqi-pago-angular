import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
    culqi: any;
    fireComponentFunction: any;
  }
}

declare var Culqi: any;
// declare var culqi: any;

// llave pública para culqi
const CULQI_PK = 'pk_test_M0TYRagiwjjSHo3n';

// url del endpoint propio que solicitará el cargo a culqi
const CULQI_MYCHARGE_URL = 'https://rulokoba.me/culqi-demo/charge';

// ejemplo de token de autorización para CULQI_MYCHARGE_URL
const CULQI_MYCHARGE_AUTHORIZATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  Culqi: any;
  culqi: any;
  fireComponentFunction: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.Culqi = Culqi;
    window.fireComponentFunction = this.componentFunction;
    console.log('Culqi', Culqi);
  }

  // LIB
  //////

  /**
   * Devuelve una función que se puede asignar a window.culqi
   * - culqiPk: Llave pública provista por el dashboard de culqi
   * - settings: objeto para inicializar el formulario de pago
   */
  setCulqi = (culqiPk:string, settings: any, options: any, metadata: any) => {
    this.Culqi.publicKey = CULQI_PK;

    this.Culqi.settings(settings);

    this.Culqi.options(options);

    return () => {
      if (this.Culqi.token) {  // ¡Objeto Token creado exitosamente!
        const token = this.Culqi.token;
        const tokenId = this.Culqi.token.id;
        const getSettings = this.Culqi.getSettings;
        console.log(`Se ha creado el objeto Token: `, token, tokenId, getSettings);
        const data = {
          amount: getSettings.amount,
          currency_code: getSettings.currency,
          email: this.Culqi.token.email,
          source_id: tokenId,
          metadata
        };
        console.log('data', data);
        const headers = {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: CULQI_MYCHARGE_AUTHORIZATION
        };

        this.http.post<any>(CULQI_MYCHARGE_URL, data).subscribe(result => {
              console.log(result);
              this.componentFunction('componentFunction');
              window.fireComponentFunction('fireComponentFunction');
              Culqi.close();
          })

        // axios.post(CULQI_MYCHARGE_URL, data, { headers })
        //   .then(result => {
        //     console.log(result);
        //     Culqi.close();
        //   })
        //   .catch(error => {
        //     console.log(error);
        //     alert('Ocurrió un error');
        //   });
      } else if (this.Culqi.order) {  // ¡Objeto Order creado exitosamente!
        const order = this.Culqi.order;
        console.log(`Se ha creado el objeto Order: `, order);

      } else {
        // Mostramos JSON de objeto error en consola
        console.log(`Error : ${Culqi.error.merchant_message}.`);
      }
    };
  }
  amount = undefined;

  public onPay() {
    const amountC = this.amount ? this.amount * 100 : 0;

    const culqiSettings = {
      title: 'Culqi Checkout Demo',
      currency: 'PEN',
      amount: amountC,
      order: '' // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
    };

    const culqiOptions = {
      lang: 'auto',
      installments: true,
      paymentMethods: {
        tarjeta: true,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false
      },
      style: {
        logo: 'https://culqi.com/assets/images/brand/brandCulqi-white.svg',
        bannerColor: '', // hexadecimal
        buttonBackground: '', // hexadecimal
        menuColor: '', // hexadecimal
        linksColor: '', // hexadecimal
        buttonText: '', // texto que tomará el botón
        buttonTextColor: '', // hexadecimal
        priceColor: '' // hexadecimal
      }
    };

    // data arbitraria que culqi incorporará tal cual
    const metadata = {
      correlativo: 123,
      nombre: 'Ana Aragón'
    };

    // preparar la funcion culqi
    window.culqi = this.setCulqi(
      CULQI_PK,
      culqiSettings,
      culqiOptions,
      metadata
    );

    // abrir el formulario de pago
    this.Culqi.open();
  }

  public componentFunction(source: string) {
    console.log(`Ejecutada desde: ${source}`);
  }
}
