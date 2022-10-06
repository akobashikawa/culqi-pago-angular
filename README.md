# Culqi Pago Angular

Simple formulario para llamar al formulario de pago de culqi con el monto indicado, usando Angular.

## Explicación

- El **formulario de pago de culqi** permite usar un medio de pago, como una tarjeta de crédito, para hacer el pago de un monto especificado.
- `Culqi` es un _objeto global_ que se importa de https://checkout.culqi.com/js/v4
    - Debe ser seteado previamente 
        - `Culqi.publicKey`: llave pública creada en el dashboard de culqi
        - `Culqi.settings(json)` permite indicar
            - `title`: título del formulario
            - `currency`: moneda a usar
            - `amount`: monto a cobrar
        - `Culqi.options(json)` permite indicar
            - `paymentMethods`
            - `style`
                - `logo`: url hacia una imagen, que se mostrará en la cabecera del formulario
- `window.culqi()` debe ser seteado previamente
    - Será ejecutada al presionar el botón de pagar del formulario de pago de culqi
    - Debe preparar un *objeto* `data`, que contiene
        - `amount`
        - `currency_code`
        - `email`
        - `source_id`
        - `metadata`
            - el objeto `metadata` es para agregar datos arbitrarios definidos por el usuario
    - Debe enviar `data` vía POST al *endpoint de charge* que se haya definido en el backend
- `Culqi.open()` abre el formulario de pago
    - Cuando se presione el *botón de pagar*, ejecutará la función `window.culqi()` que se haya definido previamente
        - Si todo va bien, el *objeto* `Culqi.token` es el token que será seteado por Culqi
        - Se envía la data al *endpoint de charge*

## Uso

- `npm run start`
