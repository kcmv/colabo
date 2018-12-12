# Intro

rima_core is a Colabo puzzle that provides a core support for the RIMA component of the Colabo ecosystem.

It contains core entities of RIMA, description of a What, How, Who, ...



## User Display

### Avatar Img

added **static method** in service
koja omogucava da asinhrono proveravamo da li user ima avatar na severu
ako ima prikaze ga kao za mene, ako ne (ako img Loading failuje), onda **genericki avatar** vraca.
i sada gde hocete avatar u HTML, samo dodate:

```html
<img class='user-avatar' src = '{{userAvatar() | async}}'/>
```

a u kodu te komponente samo se doda:

```typescript
public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }
```

