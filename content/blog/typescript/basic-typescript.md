---
title: 타입스크립트 기초 정리
date: 2022-09-12 17:09:01
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

## 왜 타입스크립트를 사용하는가

- `정적 언어`인 자바스크립트는 실행시점인 `런 타임`에 타입이 결정되고 오류도 그 때 발견된다.
- 반면, `동적 언어`인 자바나 타입스크립트는 `컴파일 타임`에 타입이 결정되고 오류도 그 때 발견된다.

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/BAMwrgdgxgLglgewgAgIYBN0AoJgLYCMAXMrngEYCmATgDSn4BMJZV1AlEazcgN4BQyIcihIAzggA2lAHSSEAcxz4C9Mo3YBuQcOqUYYaijIEA1Ov4BffvwD0ttJixa7DjNgIv3WVcg3b7R2wAZloAFloAVhdA7wAiAAtKSXk4+jiAdwRqSXQ4rSA)

## 기본 타입

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/DYUwLgBAhg5iBcA7ArgWwEYgE4QLwQGYAGAbgChRIBLAZwEEATZYMedAe3dCkTwjCzIQ5StCRpMWANoBdPlICMAGgBMSgjJHhoK+HSxYoATwA8KDNgB885Wo3kK2gO4gQAawXwaAqohiz5AHJUdkRApQhAsCFAzUdIF3ddfUNTbyxfGGt8KWDQ8MjokFiHAHpSiESPADoAB2QaAAsACgAWAEoIcoh9GDQQREh2ADN+I1qQSPNJQIhaCER2SCgaGioYRCh0UH52CFqoQ1RwbAgRsYnI9MzA6uaVAlaAVnayN+7AHKXAGFWIAFoIQAe44BHZsAJUOAEZ7ADodEEAAwuAUPHAC7jEEAJ02AH06IIAZVoggA+RiCADCGIIAI8aR1TeonQ8Ck1z8EWm2DiZHQQQAXgUFJouhVAAA1gFKmsjdRk5ZSRFns7qACN6eW90FIiDJqmB2AAZdgAYygoGVLiwAGEViBmu0HHyKgA3dhUBg0kAm7DGiBmi2AFKaIIALVdxgAXRwA4gxBACKjgBZuiCAYJrACPNEEAGD2ADTXABqrgAHJiCAKVHACLjGIggBqBwCVY4AdVeJZGGyEQKrAVFCEBoxgAEiBgMB2Ab4A6GBAAN5kCBtiAq0I0Lggao1mDNQKNKs1wKvAC+7wqiGt2GdgFtVwCDAxB3YAb9rRkajgAcawAZDRBAIBjgAWxwAR6xBALoNO7j8edbsAGuMw2GAHnGoRnAAareMJObzBaLJaa7CcABRAx2CwOsZxtHAW3bfhGiwACFhAJwIGA+CwMNMhJ1zfNC2LXhfGGZV2FqcDZyg1t2ycRoqFAZoBCETpoJg9tugYPZu2OMBqL8Ci20nLDugGNAIEAAXGIEAET7AHahzMIEAJBrABOWwAfBsAGs6IEANm7AAnRpFAAOaiBAF2BwBAGqjQAXLogQAcFpzQTzHdOTk0AH4mr0fUzAATxwBN5ufCAiEAAN7AAZFiBABwhz1AABmqEFEASlGIEAXMnORk2TEVfQBPpos6o2zIITUAgAB5Ghm14iAAHVfDY5D8AIJQ8oASXYGhypguhEAYeCLUwt5O0QbtQD7dgB2yqQNE6boACJCoagDBrINqOt7ftml6wIqpoWIBoqVopwgdL3WdQBqIeczlfUAGaaIEADm7nMAF9HQ1hQBSDvffEiRSpFABnOiJAAumwBKHsAUtWIEAE87AEVVh7zJzdKspoFRcpgkbir4QInF8cJKuqqHi0W2r23qxrzUbfBAh4BhAha+IIFQIxsvgbKVHIInsr4MnqghgCHEmnsuoHSmaENDkIEGmHEHGu0UGrCJ8wYEBhl8EAGAJlVxGrPh+eALRIAYeAhZFsXMYgFXRZnBgSCAA)

```tsx
let age: number = 30
let isAdult: boolean = true
let a: number[] = [1, 2, 3]
let a2: Array<number> = [1, 2, 3]

let week1: string[] = ['mon', 'tue']
let week2: Array<string> = ['mon', 'tue']

// week1.push(4) // Argument of type 'number' is not assignable to parameter of type 'string'.(2345)

// 튜플 - 인덱스별로 타입이 다를 때 쓸 수 있다.

let b: [string, number]

b = ['z', 1] // 가능
// b = [1, 'z']; // 불가능

b[0].toLocaleLowerCase()

// void, never
// void는 함수에서 아무 것도 반환하지 않을 때 사용한다.
function sayHello(): void {
  console.log('hello')
}

// never는 항상 에러를 반환하거나 영원히 끝나지 않는 함수의 타입으로 사용할 수 있다.
function showError(): never {
  throw new Error()
}

function infLoop(): never {
  while (true) {
    // do something
  }
}

// enum 은 비슷한 값들끼리 묶었다고 생각하면 된다.
// enum에 값을 주지 않으면 자동으로 0부터 순서대로 1씩 증가한 값이 할당된다.
enum Os {
  Window = 3,
  Ios,
  Android,
}

console.log(Os[3]) // "Window"
console.log(Os['Ios']) // 4

// enum에는 숫자가 아닌 문자열도 입력할 수 있다. 다만, 단방향 매핑만 된다.
enum Os2 {
  Window = 'win',
  Ios = 'ios',
  Android = 'and',
}

let myOs: Os2
myOs = Os2.Window

console.log(myOs) // "win"

// null, undefined
let c: null = null
let d: undefined = undefined
```

## 인터페이스

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/DYUwLgBArgziBOAuA9gIwFYgMZgNwCh9YEIBeCAb3whogDsBDAWxEQgHIAPT9gGmtoMA5qwDMABnwBfQlmR0YyUADpgyIQApi8ZYxYBKCAHojEAArxkABwRgAnhz0h2EACbIQMeskghOASxhIeQh7Gw40TBx2ZQ0AJlFRAE59fBMISOxIQAGFwFDxwAXRwBSmiEBOpcBUCYhAEFXAHQ7AH2XAB6X8iEAAZsAdVYgywBeewAAaiEAx0cAGOohAGVbADm7AF3HAE6blQnSahsAfTo7ADXHAF1XAHEGIQFwawBaZpcAdFcAQNcANVcADmohAN6HAEXGR4sAPccAGRcAM5fHAEqGlwBqBwEqx1unCMJAEAAynJ4IDyOwAIIuAA+HAAQrCOABhJHsABi7AI-joYAQADMGFhAQBVODwSgCGhONhBeA4oQEWgQYSsehQJioBBM2giOiuBAAflpYHpdEZxlMgFYxwAqg4AERqpEDBDHcdGADlQ-ngYAAFgBNEAMJDszncxUAbSE8BVrDoHK58AAuhA2CDkGDcJKIKNAAnjgBfRiB3QCOza8IOtAKFdvAggBKFiDjQAhnYABcYggBFRwAs3YAHGsAGQ0QbqAUqbpIRQJBtHE2GSSOQqMyaRxuHxFay2BJ+MzNdr9YbjXFxL3W7QAIxsKEN5llhGj2iiYcAURc6QAKnZwuwAEQz1cuQLeSAMGAwfxCRioUChZChZeA9husExeKiOJxVIyIjkuLKdu6g1GsgQAdJJJxE9dJkQYOg6B8Fl90POgzw4T9OyNFwuSwBhiAgfxIG3BglUNVwAFp5HVCArEsGxtTsWI4gAVgAFnEQx8DkBQlBAVR1C0N9lFZfQCDSUxHheV5qggQALVcADCGVmOAZ8BxPF4EJYkIEhVxXEpZkNDtJghxNB0oy0sstIdfQ2CMs0X2YoIWVUtgVLU8h8SgOgcH8eQNE4KM7EMataDBMAoHgWDOAgABqCA7AIF85IJIlAQASRgFSoGASAfJoDQm10hATIgVBkFYsDItkeQrIYRAEqSlLfwykRDFIAA+dTfPAALYNZCB6v-Ir+MDZ43hEwAXBcADPbQzKZZpNk3EYqU0CKTSiA5DUY06QZHkaAAdx1EAQGAGBTPtM1mSCI0wA0HKADdkH8VxuqwYA9y8eEmHWjCmCsUAWFxLxZqamhFvdNaIE27bdt-WjAcs0UoBwd0NCwRAVvFbzFWZXVAmUf6KXILBAZkI6wBOs7fuZBaStY9jNHYIRkGUWn2F4xUZCkCBioUSBUF-OgQBep71o0KmwRAOh6YISzybUTRUAZ1BlGO7Uzr49JBLeYpAFU1wBS8cAEebczzY5pggPw8X5GBJvkxTAXhIWAC8Dc4I3XG+n95vcd19tNeBAaCawzrYS7rtukr2etthLboG2q0VF3jWo-saC9qwzvm5kxZUCX+fjkXGdj0mluHE8iQAa0nDatp2vaIFo7O5dO5GSdoFO2LT9hq-pxnCx6wAb0cAG-aIEAHBqlg1wADVYgcTtcACPG-mihTYogBdrRxYnMZFMVGUVYGy7dh1PYJ+WLqum726n83Z+QBx5trRHV6iqbp6UhdT7nhgF8NoWHdn+e6Cje+z8VUj-GJTe5kgA)

```tsx
let user: object

user = {
  name: 'xx',
  age: 30,
}

console.log(user.name) // Property 'name' does not exist on type 'object'.(2339)
// object 타입에는 특정 프로퍼티에 대한 정보가 없기 때문이다.

// 프로퍼티를 정의해서 객체를 표현하고 싶을 때는 인터페이스를 사용한다.

type Score = 'A' | 'B' | 'C' | 'F'
interface User {
  name: string
  age: number
  gender?: string // 옵셔널
  readonly birthYear: number
  [grade: number]: Score // 문자열 인덱스 서명, 키 이름은 아무거나 가능
}

let user2: User = {
  name: 'xx',
  age: 30,
  birthYear: 2000,
  1: 'A',
  2: 'B',
  3: 'E', // Type '"E"' is not assignable to type 'Score'.(2322)
}

user2.birthYear = 1990 // Cannot assign to 'birthYear' because it is a read-only property.(2540)
console.log(user2.age)

// 인터페이스로 함수 정의하기
interface Add {
  (num1: number, num2: number): number
}

const add: Add = function(x, y) {
  return x + y
}

interface IsAdult {
  (age: number): boolean
}

const a: IsAdult = age => {
  return age > 19
}

// 인터페이스로 클래스 정의하기
interface Car {
  color: string
  wheels: number
  start(): void
}

class Bmw implements Car {
  color
  wheels = 4
  constructor(c: string) {
    this.color = c
  }
  start() {
    console.log('go...')
  }
}

const b = new Bmw('green')
console.log(b)
b.start()

// 인터페이스는 확장도 가능하다. extends
interface Benz extends Car {
  door: number
  stop(): void
}

const benz: Benz = {
  door: 5,
  stop() {
    console.log('stop')
  },
  color: 'black',
  wheels: 4,
  start() {
    console.log('start')
  },
}

// 여러 개를 확장할 수도 있다.
interface Train {
  color: string
  wheels: number
  start(): void
}

interface Toy {
  name: string
}

interface ToyTrain extends Train, Toy {
  price: number
}
```

## 함수

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/PTAEgtVwMIYKAMwVwHYGMAuBLA9o0BDAJvgBSLwC2AjAFylkBGApgE4A0otATDeY0wJRUAbpnT5QAb2ihpoZNgDOmADYMAdEswBzEuQptOfaAF9o0EKEAEg4F2FwIAToQCedgHBrAAz2RAKU2hAIquQHLyIA1x0EASltBABPHAGs7AF3HAE6bVOCQ0LBwACwYlDRJcMgYqUHlUJnRETTZcTQYAflzaXgE8gqLNCSkZdFgiMoZQAEIAXl7QJHwGWCKGfD5mmWnQJgZUeCYcAAMACTSNNgAScUQshiNVUABNTHg8OdAdzqNllukjUHvZ+cWV9fTMK9392+NTcyADIbABxdgAHJ3yuUCAAYXAKHjoEAieOARkHAKk9ZjAqgxIPBTlcHkAIBOAG6bANg9gAFxiGQQA+naBAAw9gBfRwA6HaBADorgBA1wA6q7F4igMNg8IQAILpIgY1S0eTVHjMADaAF1JpJpnMFkt2OR5Ko5vh4MgGEQiHN5PAlKh9ORJr0AHwvQ3G0AAalVZDYAAY+ABuf5o0CoZLoeTQIqoZiwXA60AAVXkzCmMj22Vy+UKxQ9JmgckQ+VAAGUsrlI9GBj946AAOQ5sgl1MIblJPLJTAAdwAcvsiD6-Xmo6w8OUJfRmGxyohhkxciWKwAfEuwEvy0DmdvyaFwwANNYBUCbJOJ8gBwJwA+46BAHqjgAXRwA4g6AOc904oVOotG3feq4wxSuVBwxh8x3fOwIvArDACLjoDroALquAD6j57RJ6V6oHgoADPI9bNvsqh0EUxDlu60C4EQADMzpsOOs4el6UCgIAJGOACE99KADstJE+JRNH4sSm5+IEjiQICy5HqAgAMrYAPu2gNEgAenaAgCbzfCgGABqrgAxNaAkkeIAwTWAf4gAf3RycQBogQZMCGYb5kwMbSE+CYNMmzydH2vApqY1aJLyABWIiIJkxaJo0L45I6tSdswbrfuRVG0bZPI4I5RQuZ5bnFB5JlJpodRRZofnmAxQUJCFoBhc5xn1HFMVedGE65Y0dT6aARWJYZoBtG2ACeAAODCYLAPZdP0AwljUzCzlViqvCqCozENT4sM8Q3SJ0Y0yCY0wzTISpvKWgKRB4gDUQ6EjIwoApB3AYAPxOAByDgApY6oJZQQoMHyLmEZdnBmVOUQABEl1kA9bB4Zh0GZbgiCRaZTQDFlj0AFLfQwr2gA9eEPXwQA)

```tsx
// 함수
function add(num1: number, num2: number): void {
  console.log(num1, num2)
}

// 선택적 매개변수는 필수 매개변수의 뒤 자리이다.
function hello(name: string, age?: number): string {
  if (age !== undefined) {
    return `Hello, ${name}. You are ${age}`
  }
  return `Hello ${name}`
}

// 나머지 매개변수 타입 작성법
// ...나머지 매개변수는 전달받은 매개변수를 배열로 표현한다.
function addAll(...nums: number[]) {
  return nums.reduce((result, num) => result + num, 0)
}

// this
interface User {
  name: string
}

const Sam: User = { name: 'Sam' }

function showName(this: User, age: number, gender: 'm' | 'f') {
  // this 타입 결정은 매개변수 제일 앞에서 한다
  console.log(this.name, age, gender) // this의 타입을 결정해야 한다
}

const a = showName.bind(Sam)
a(30, 'm')

// 함수 오버로드
// 함수 오버로드는 전달받은 매개변수의 개수나 타입에 따라 다른 동작을 하게 하는 것을 의미한다.

interface User {
  name: string
  age: number
}

function join(name: string, age: number): User // 오버로드
function join(name: string, age: string): string // 오버로드
function join(name: string, age: number | string): User | string {
  if (typeof age === 'number') {
    return {
      name,
      age,
    }
  }
  return '나이는 숫자로 입력해주세요.'
}

const sam: User = join('sam', 30)
const jane: string = join('Jane', '30')
```

## 리터럴, 유니온/인터섹션 타입

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/PTAEhrOwGRcF-bUAYXCh4wKAMYHsB2BnALqArlgKYBOAcgIYC2RAjKALygBEAQmgEbMDcoIo6bDkApTfAShACeOAWmcAANRBgt2XMUgA2RPIVKUaAJkYsAKmio8kSHAE8ADkVAApTgebW0qgJYoizUAB8WACZEAG5Eqmi2JD7+zDhEFCgAFqRmSO4YcSQAZgl2AKrEJKAA3kig5aAY1EQAXKC4JOkA5txlFQBWnHWOHK0AvuaCuASFdQWkBqUVldV1bJzMADRt5Z0cc64eXsxIA2kZpDleoAAS7k2JAMpJaG6XOPhBGSUrMzR1GPhUHBP+Dc2taZNEgUIJ1ej+fT+ADM-XM-EABOOACabABRjKnSmSOdgAwhQilMKlV3iwUHieKBXuhwiQ6v8MC1Xrg8TgABQASjqwTQ7gCcP2mNyoAAspx3OoXtMibUWFROB5vICKlS0DT6jhGvTFeVSapVOzOdzebtzFl8BgUDh3JhQE0NABxdxZVlNR04Oq4or+EUcMVENklPhgQC7Q4ARntAMkApU2AHVXQMi0YhKZgsG4iAA6cJNFkup2p5UkNla0COrOu1NSxgMJjMUlRf0E6blbM4VNMkisguvPqgMLECUNxulnV6jvTAZ7fiAD3HIIBOQcAGoMqfiAG9HADftYkAIuOgQCWq4ANOdEgAdm0CAGoHAJVjUcAJ02p-mHQWGEHpPvlKW09UAxk4Zn60Bcnl8jHX47GJYD5vNKdIMtMebPhq4EVNYjReB8Xw-CQfJDHgOBoJYHp1IBoAAGSgLeFD3kwxSBqAgAVXYABy3rqAZ6gIAgBOAC2jgA+o6A56vE+LBwIAKWNLG+H51n0ywQW4KpzBwqj4N4ImwfB0q0AADMpyx9EAA)

```tsx
// 리터럴 타입
const userName1 = 'Bob' // const는 타입 자체가 리터럴 "Bob" 타입
let userName2 = 'Tom'

type Job = 'police' | 'developer' | 'teacher'

interface User {
  name: string
  job: Job
}

const user: User = {
  name: 'Bob',
  job: 'police',
}

interface HighSchoolStudent {
  name: number | string
  grade: 1 | 2 | 3
}

// 유니온 타입
interface Car {
  name: 'car'
  color: string
  start(): void
}

interface Mobile {
  name: 'moblie'
  color: string
  call(): void
}

function getGift(gift: Car | Mobile) {
  // 식별 가능한 유니온 타입
  console.log(gift.color)
  if (gift.name === 'car') {
    gift.start()
  } else {
    gift.call()
  }
}

// 인터섹션 타입
// 여러 타입을 합치는 데 사용한다.
interface Train {
  name: string
  start(): void
}

interface Toy {
  name: string
  color: string
  price: number
}

const toyCar: Toy & Train = {
  // 모든 타입을 다 적어야 한다
  name: '타요',
  start() {},
  color: 'blue',
  price: 1000,
}
```

## 클래스

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/MYGwhgzhAEDCYCdoG8BQ0PQPResA9iPggFzQQAuCAlgHYDmA3NrgCoDK0gNQOCVY4DtD0QCZdgEJ7AAz2AMIcApTdEAf3YBrO6IAJBwB2jgF1XAGJOAfUeiAdVcAnTQDp0mArUoIArsArEAFAAcLAIxDVgeQsTLm69AJQoLEJi4tw8gBqrgAOT0IBSo4A844AkHYAuXdCOLm4ANNAIAKZgACaEtACeYfrGmJgUABbUEAYEREgAvB5NjBXQAL6dlIgUtgFolZWmEIQ5BkT0tgBEfQgUs36dPT2oYxTQTgC2AO7QrbQ5B-AIc7n5yx2oONCAiBOAP7XQgDgTOoAJ49AAtKnOrsBZew0ABuYAoOUBCHw4OsOXyt1wQOooPB0EAPzXQADEgAFx6CATebAD7j4UMCOggBFRwAs3YBgmsAI83QQASo9BAIATcRSaX+gBdxvQbcBQOCIABMKE6SJROWgYHoOTItAsOycORa0AAjB1KkDoTlYfloLQwDtpeQqL5DtBZsBELM1ZhcgV8LQQKU9tUcjkQBAZXKFUqACzWjB9ChuaA5Y4IeilVoAcnw1BAUf9bS8RpoDETm0s1jsjWTPgYGSGnUqNTqDU8SpzCET60qCwGhZGJnt4xAk2mczr1yLTbMEym+BmJfqeoNfkTo2bffbQ4MkpyY9WqHWoEgMAAQvsQwAPcG0fIwM5C4Y98xWGznSveY0MBuN8gWeyK2yVheVHq16r4PYAOX1OUGwp3h4vatv2MwQA+iqzlKY5BKKYI5LiqiAJ9N0CAC4LgAZ7YAJUPQIALQ2AAG9gALo4AOIOADOdYSAAar0ChIAEeOAAc10DvIAu0PodheFEcR+GAAyL0CABwzgAOE1RoSAGOjJJAWMU4DrYEGPggBgjvO44npJ4GQXJzquu6r53hJoHtjJUGhoqEawXcgZuHEgA6HUoyiADgt0CAKgTTLBBI0iAB7jWGACyLWGAAA15KABNNgA+7axWGAKFdVkPI85TiZOelSYeBhGeGxTaRgayoBszZbAAXj6prHAcG57HMLhgMAADWXa6W2Um5fJf4BHcGowuC+TSMxIXsSRfGCdR0A0XEgAZDdAHneSR0gCUJ0CiUYdUaW6MCtAAbMwdy2oUDrFIAGuPQIASDW4qNWHdeIDlTTNGWkoAKbOAIMDIWoGATjmGVWwrnyZwAMyAU2TRXqmTCdBmZ7ZuWv2+LejYzpWpqVtWvQUP0AHHo21VgR28OLMsi6VJ0D1PdY0CFOw+AGiWDCDGQwKxvkHTLlleCIPlJz8gg70XHC1xBDdIWAD6duonNZgAoPdZh286RgAnLdR0iiRlr3rqG2Xbru+7M59yBBNdgCxg4AIuPQIArYuqGRYTQD5gClTcSANZZm57PiDKZg19jYGRe5apd0nR3JrgDYPbiXOACpdxGADst0he7igDPNd1gA2tYALTMstZDlbao2jRZghPEzkpMzODIxgK2iy2O9rvpZlZhbGAACsjOFfLJXgBVyxAA)

```tsx
class Car {
  // color: string; // TS 사용시 멤버변수는 미리 선언해줘야 한다.
  constructor(public color: string) {
    // 멤버변수 사용하지 않으려면 public, readolny 사용한다
    this.color = color
  }
  start() {
    console.log('start')
  }
}

const bmw = new Car('red')

// 접근 제한자 - public, private, protected
// private 과 #은 동일하다.
// 아무것도 안 적으면 public이다
class Car2 {
  private age: number = 1
  protected name: string = 'car'
  readonly wheels: number = 4
  static energy = 'oil'
  color: string
  constructor(color: string) {
    this.color = color
  }

  start() {
    console.log('start')
    console.log(this.name)
    console.log(this.age)
  }
}

class Bmw extends Car2 {
  constructor(color: string) {
    super(color)
  }
  showName() {
    console.log(super.age) // private은 해당 클래스 내부에서만 사용할 수 있고 자식 클래스 내부에서부터 참조할 수 없다.
    console.log(super.name)
    console.log(super.wheels)
    console.log(super.energy) // static으로 선언된 정적 멤버변수는 인스턴스가 아니라 클래스명으로 접근한다
    console.log(Car2.energy)
  }
}

const z4 = new Bmw('black')
console.log(z4.name) // protected는 자식 클래스 내부에서 참조할 수 있으나 인스턴스에서는 참조할 수 없다.
z4.wheels = 6 // readonly의 값은 인스턴스에서 수정할 수 없다.

// 추상 클래스
abstract class Car3 {
  color: string
  constructor(color: string) {
    this.color = color
  }
  start() {
    console.log('start')
  }

  abstract doSomething(): void
}

const car = new Car3('red') // 추상 클래스를 new로 바로 인스턴스를 만들 수는 없다

class Benz extends Car3 {
  // 상속을 통해서만 사용 가능하다
  constructor(color: string) {
    super(color)
  }
  // 상속받은 추상 메서드는 상속받은 곳에서 구체적으로 정의해야 한다
  doSomething() {
    alert(3)
  }
}

const a5 = new Benz('black')
```

## 제네릭

- generic: 일반적인, 총칭적인, 상표등록이 되어 있지 않은
- 선언할 때는 타입 매개변수만 적어주고 생성 시점에 사용 타입을 결정하는 것이다
- 제네릭을 활용하여 하나의 인터페이스만 만들고 여러 개의 객체들을 만들 수 있다.

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/PTAEgJBwO0cA1XUGVbApTaQAwuFDx0gTzsDg1gBnsBhDgM52iCAE4C2jgPxOAHNaILsDgjIOiA7Q4AgTgC6OiA1A4JVjKqgIuOhADTWBUCcAaq0kDBNYBdxwCdNAOgBQAMwCuAOwDGAFwCWAezWgA5gFMtAZR0AvEwB4AKgD4AFAEMATu4BcoewG0AXQBKHzUVAFsAIxN3UABvBVAk0HczFXdDD3c5ABsTNSMtAAsAbgUAXwUFDQMAZy1QLIBGUABeUD8mgBoAJi6AZgDquoasnraOgCJXSa7JyNnJjUmhhRBQQA9xwAZFwAzlqUASodZAHEHQQBwJwBJGwFrOzi41sAvASA6BQB01rlFAG9HQUUAMhsANcc3dgciARACct1HegBv20BYf6AXBrAC0zIIEoNAeFAgAjx+QKHRqLQxJSuDQmUAAWT0kR0eQcjniiWSalc4RMPnq7hxRjKyVAAAc2UTQhFou5Ock9NzdAYfPYypVhmp6qBwk0vGSKVTyQArEzaGntBJchlMnyTWo9JqzOlJXk6fmgJoABkdXUtoDFErUPn1XOSNRyem8oEmqQAJhbvT69CpuZLQAScrUTC7KrKavKGuEeiryZS7Kz2braQbGczA6bzc6udbbQ6nS63foPYGjHo9KGKlV1qBsbj8YTiQBVBOxL1JQ0lvMFEVJVymAVRGIyqo4vHuAlE0AAYQ8hfpxZZWjZk5dvv9+8PHPb3ZXa+JACEWwBrHdWvklsLz4WX1MKlRDnyDmIJjiMdjRmLpGlnO17XKMpvwaDQPB8LdYj1EDA0icIAHdZlAE8AyDExQxguUFUiR8fHvPQnz1KsS36R1oLKZR1G0BtQFqIo9EwgA5YsHFAEwAA88TUYNaniNCJyMcoXGDVwtFcKUQnYg92WfFI0gyUA5IUuQx0XBQOK43imWcX8YiCMojJ44tnAQ9xLLudjOJs0yyKoyzQHWVgISAA)

```tsx
// 선언할 때는 타입 매개변수만 적어주고 생성 시점에 사용 타입을 결정하는 것이다.
function getSize<T>(arr: T[]): number {
  return arr.length
}

const arr1 = [1, 2, 3]
const arr2 = ['a', 'b', 'c']

// 인터페이스에서 제네릭 사용
// 제네릭을 활용하여 하나의 인터페이스만 만들고 여러 개의 객체들을 만들 수 있다.
interface Mobile<T> {
  name: string
  price: number
  option: T
}

const m1: Mobile<object> = {
  name: 's21',
  price: 1000,
  option: {
    color: 'red',
    coupon: false,
  },
}

const m2: Mobile<string> = {
  name: 's21',
  price: 1000,
  option: 'good',
}

//
interface User {
  name: string
  age: number
}

interface Car {
  name: string
  color: string
}

interface Book {
  price: number
}

const user: User = { name: 'a', age: 10 }
const car: Car = { name: 'bmw', color: 'red' }
const book: Book = { price: 3000 }

function showName<T extends { name: string }>(data: T): string {
  return data.name
}

showName(user)
showName(car)
// showName(book); // 에러
```

## 유틸리티 타입

[TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play?#code/PTAEGsFME8HsDMBQiCWA7ALpATvAhgMaSgCqAzjqAN6Kh2goAmAXKGgK4C2ARjgNy16aPJ0isyGbOgDmA+qDzSxbLr2xz6StIxysARJz2gAPqD3w9AgL7IM0AA7FyOANIxQAXggwEpCutAQUAByJmCTEOFRcNNgxUgYkK0dbGDkAlg0CVB2cFZnbDdoTzN4y2QggAU8bAwUPAAbAB4AFQA+RCDAGGXAHUHAAXHQQBBVwB0OwB9lwAelwB9O0EAKrsAFFtBAVjHAFUHABEbh0EAUHsAV+sAAScATpoA6VEwcfCI-HAAmakE6JlYOHn47thFlCSk0WVf4x9UXvJkrozIYIuZyjZOmB0FhcIQnP4bjQgvImAB+f7PdTQ+RvUSY0CfGQCVH0eKEp5qUlgIGQbQ4QkGIymCE00BQhqQDAKRicdCsaq1erNAptEq3NEsUAARgANK8ospgtxYNxggqoUEAEqQACO7BQ2EgjFaHSCgBrOwAO84AXccAPaOAHZbAClNs0ABy1DMaABkWLdNACKrgAwhjabQA99UcTnDzoicABmSX0B4qbEaOhK8SSEm-JSUgEBIIrVY2wATo4AeccAGQ2gQAio4AM9sAC6OAHEHQLqDUaTaBAIATgEqxwA7Q6AAxtAAM9gF6awAULYhOdycv5o6wm4bjaaCtHxV4aFLWPLFe99KruHpNRUwLq8IxMg1oGbw2cEZdsAAWOP3aVUwFCLdE9PfZMKLNY6mgMfIFyPLsP4t4zpAx6nueBS3suD4MNKG7yKmZg7nuAGICBOC3ocTAlLefCBGAIwTKAgBINaAQ6gIAEb2AAA1B6NpAGTYKaLhyqA7S4rCV4XAAysxkAAELQAA4tgx7ECitL0HoMp6PoACCLJmIJyl6AAwmpAAi5RknQehXPJZhKeCqngpp4I6ey8h6NGRl6CZrJmayFmslZuI2be9mOSpamuWY7lBFCdiOKAYkSSUwQyokwRXDF0YxbewQCCFxD8bAxqRQpMWCTF6kxVpMUAGLJYgGRZDyZACeBzGmuFOjselxpwau9AyqwwTZQq8hXB1+XdfQ04hIVA10GBIQlfuuKABAdgAq8w6oCADprHagIAEGOADgTyDcfCFwFAArPBCbPjiyFvsSn6Zsox3WMg8DsGgBB1JkDBkAAao0TAABRYdg+T+HtACU8HldkxpkOwDQYDVGWmlAcDwDee3saqsBcngaAta8a6TjguGMKA4oAAyjXiKE-YcSqgAAhB4Xh6OheLkkorDk-EBOgMTrw2PIxoYOw2BoKAYMQxgN0MZUKAEOArTsS45pgC09agC4HoTIAGuOgIAAwuAKHjgAznaAEtS4ALqsNoANQMdoAOqv7JeO1RtgABsh1PjmX4oedPzyH8ibUq8wK-WYACyakAOqQgIZWZNkP324KkvSwU7GhIwMVKsEmPY5zp2iB1O5pFY4dBAA8vyGAy3LuKACRjgDQPQMgCdS4AqBOq1MoCALsDgCt7YAGquADejoDm4ABqugP6oCABHjRz-iDwH+AA7KwxcoKXCdJPSKQxfEaclK1j6sJnr7ZyEudjgXYAAKIAB4EA07A6K08ocVc8scTKWva0rLQ3DrgAi46A62AB5jFvP1-c2CpUqPxKO7CIx0IgozRmgFKDhiBvxKGfC+V9IA33YpA0w7s2iESCNAiCaAGIADlMhEIhg0PA3AuStHgQ-DgDQGjsXujoeA6ATQYMgAAN0oL-f+n9W6AEZB2w8COKxi8PQhoERmGQFYWgVspg5HcOwBEThsA8JYI-D8EBLR7xeBIWgMhDDKHUJaEuXBYBVHqPfF8aQyBkBAA)

```tsx
// keyof

interface User {
  id: number
  name: string
  age: number
  gender: 'm' | 'f'
}

type UserKey = keyof User // 'id' | 'name' | 'age' | 'gender'

const uk: UserKey = 'age'

// Partial<T>
// 파셜은 프로퍼티를 모두 옵셔널로 바꿔준다.
interface User2 {
  id: number
  name: string
  age: number
  gender: 'm' | 'f'
}

// interface User2 {
//     id?: number;
//     name?: string;
//     age?: number;
//     gender?: "m" | "f";
// }

let admin: Partial<User> = {
  id: 1,
  name: 'bob',
}

// Required<T>
// 리콰이얼드는 모든 프로퍼터리를 필수로 바꾼다.
interface User3 {
  id: number
  name: string
  age?: number // 옵셔널이었으나 아래에서 Required 적용시 필수로 변경됨
}

let user3: Required<User3> = {
  id: 1,
  name: 'bob',
}

// Readonly<T>
interface User4 {
  id: number
  name: string
  age?: number
}

let user4: Readonly<User4> = {
  id: 1,
  name: 'bob',
}

user4.id = 4 // 프로퍼티 값 변경 불가

// Record<K, T>
// interface ScoreByGrade {
//     "1": "A" | "B" | "C" | "D";
//     "2": "A" | "B" | "C" | "D";
//     "3": "A" | "B" | "C" | "D";
//     "4": "A" | "B" | "C" | "D";
// }

type Grade = '1' | '2' | '3' | '4'
type Score = 'A' | 'B' | 'C' | 'D' | 'F'
const score: Record<Grade, Score> = {
  1: 'A',
  2: 'C',
  3: 'D',
  4: 'F',
}

// 레코드 활용 예제

interface User5 {
  id: number
  name: string
  age: number
}

function isValid(user: User5) {
  const result: Record<keyof User5, boolean> = {
    id: user.id > 0,
    name: user.name !== '',
    age: user.age > 0,
  }
  return result
}

// Pick<T, K>
// T에서 K 프로퍼티의 타입만 Pick해서 사용한다
interface User6 {
  id: number
  name: string
  age: number
  gender: 'M' | 'W'
}

const user6: Pick<User, 'id' | 'name'> = {
  id: 0,
  name: 'bob',
}

// Omit<T,K>
// 오밋은 특정 프로퍼티를 생략하여 사용할 수 있다.
const user7: Omit<User, 'gender' | 'age'> = {
  id: 0,
  name: 'bob',
}

// Exclude<T1, T2>
// T1 타입에서 T2 타입을 제외한 타입을 사용,
type T1 = string | number | boolean
type T2 = Exclude<T1, number | string> // boolean

// NonNullable<Type>
// null, undefined, never 제외한 타입을 생성

type T3 = null | undefined | never | void | string
type T4 = NonNullable<T3> // void | string
```

# 타입스크립트 올바르게 이해하기

- 타입스크립트 목표 : 타입스크립트로 타이핑을 잘하면, 런타임 전에 미리 알수 있는 오류도 있다.

## 1. 작성자와 사용자

### 타입 시스템

- 컴파일러에게 사용하는 타입을 명시적으로 지정하는 시스템
- 컴파일러가 자동으로 타입을 추론하는 시스템

### 타입스크립트의 타입 시스템

- 타입을 명시적으로 지정할 수 있다.
- 타입을 명시적으로 지정하지 않으면, 타입스크립트 컴파일러가 자동으로 타입을 추론한다
- 타입이란 해당 변수가 할 수 있는 일을 결정한다.
- 타입스크립트의 추론에만 의존하면, any로 추론될 수 있다.
  - `noImplicitAny` 옵션을 켜면
    - 타입을 명시적으로 지정하지 않은 경우 타입스크립트가 추론 중 `any` 라고 판단하게 되면, 컴파일 에러를 발생시켜 명시적으로 지정하도록 유도한다.
  - `strictNullChecks` 옵션을 켜면
    - 모든 타입에 자동으로 포함되어 있는 `null` 과 `undefined` 를 제거한다.
  - `noImplicitReturns` 옵션을 켜면
    - 함수 내에서 모든 코드가 값을 리턴하지 않으면 컴파일 에러를 발생시킨다.
    - 모든 코드에서 리턴을 직접해야 한다.

## 2. interface와 type alias

- structural type system - 구조가 같으면 같은 타입이다.
- nominal type system - 구조가 같아도 이름이 다르면, 다른 타입이다.

## 3. 서브 타입과 슈퍼 타입

- `strictFunctionTypes` 옵션을 켜면
  - 함수의 매개변수 타입만 같거나 슈퍼타입이 아니면, 에러를 통해 경고한다.
- any 대신 unknown

## 4. 타입 추론 이해하기

- **Contextual Typing - 위치에 따라 추론이 다르다**

## 5. Type Guard로 안전함을 파악하기

### **_1. typeof 타입 가드_**

- **_보통 Primitive 타입일 경우_**

```tsx
function getNumber(value: number | string): number {
  value // number | string
  if (typeof value === 'number') {
    value // number
    return value
  }
  value // string
  return -1
}
```

### 2. instanceof 타입 가드

```tsx
interface IMachine {
  name: string
}

class Car implements IMachine {
  name: string
  wheel: number
  constructor(name: string, wheel: number) {
    this.name = name
    this.wheel = wheel
  }
}

class Boat implements IMachine {
  name: string
  motor: number
  constructor(name: string, motor: number) {
    this.name = name
    this.motor = motor
  }
}

function getWhellOrMotor(machine: Car | Boat): number {
  if (machine instanceof Car) {
    return machine.wheel // Car
  } else {
    return machine.motor // Boat
  }
}
```

- Error 객체 구분에 많이 쓰인다.

  ```tsx
  class NegativeNumberError extends Error {}

  function getNumber(value: number): number | NegativeNumberError {
    if (value < 0) return new NegativeNumberError()

    return value
  }

  function main() {
    const num = getNumber(-10)

    if (num instanceof NegativeNumberError) {
      return
    }

    num // number
  }
  ```

### 3. in operator 타입가드

- object의 프로퍼티 유무로 처리하는 경우

```tsx
interface Admin {
  id: string
  role: string
}

interface User {
  id: string
  email: string
}

function redirect(user: Admin | User) {
  if ('role' in user) {
    // = user가 Admin이면
    console.log(user.role)
  } else {
    console.log(user.email)
  }
}
```

### 4. literal 타입 가드

- object의 프로퍼티가 같고, 타입이 다른 경우

```tsx
interface IMachine {
  type: string
}

class Car implements IMachine {
  type!: 'CAR'
  wheel!: number
}

class Boat implements IMachine {
  type!: 'BOAT'
  motor!: number
}

function getWhellOrMotor(machine: Car | Boat): number {
  if (machine.type === 'CAR') {
    return machine.wheel
  } else {
    return machine.motor
  }
}
```

## 6. Class를 안전하게 만들기

- Class 프로퍼티의 타입을 명시적으로 지정해야 한다
- `strictPropertyInitialization` 옵션을 켜면

  - Class 의 Property 가 생성자 혹은 선언에서 값이 지정되지 않으면, 컴파일 에러를 발생시켜 주의를 준다.

    - Class Property가 선언에서 초기화

      ```tsx
      class Square3 {
        area: number = 0
        sideLength: number = 0
      }
      ```

    - Class Property가 생성자에서 초기화

      ```tsx
      class Square4 {
        area: number
        sideLength: number

        constructor(sideLength: number) {
          this.sideLength = sideLength
          this.area = sideLength ** 2
        }
      }
      ```

# 실전 타입스크립트 코드 작성하기

## 1. Conditional Type을 활용하기

### **_Item<T> - T 에 따라 달라지는 container_**

```tsx
type ArrayFilter<T> = T extends any[] ? T : never
type StringsOrNumbers = ArrayFilter<string | number | string[] | number[]>
//string[] | number[]
```

```tsx
type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
  ? T[keyof T]
  : T

const numbers = [1, 2, 3]
type NumbersArrayFlattened = Flatten<typeof numbers>
// number

const person = {
  name: 'Mark',
  age: 38,
}

type SomeObjectFlattened = Flatten<typeof person>
// T["id" | "name"] --> T["id"] | T["name"] --> number | string

const isMale = true
type SomeBooleanFlattened = Flatten<typeof isMale>
// true
```

### infer

```tsx
type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any
const promises = [Promise.resolve('Mark'), Promise.resolve(38)]

type Expected = UnpackPromise<typeof promises> // string | number
```

### _함수의 리턴 타입 알아내기 - MyReturnType_

### 내장 conditional Types

```tsx
// type Exclude<T, U> = T extends U ? never : T;
type Excluded = Exclude<string | number, string> // number - diff

// type Extract<T, U> = T extends U ? T : never;
type Extracted = Extract<string | number, string> // string - filter

// Pick<T, Exclude<keyof T, K>>; (Mapped Type)
type Picked = Pick<{ name: string; age: number }, 'name'>

// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type Omited = Omit<{ name: string; age: number }, 'name'>

// type NonNullable<T> = T extends null | undefined ? never : T;
type NonNullabled = NonNullable<string | number | null | undefined>
```

## 2. Overloading을 활용하기

## 3. readonly, as const를 남발하기

## 4. optional type보단 Union Type을 상요하기

## 5. never 활용하기

> 참고
>
> - [코딩앙마의 타입스크립트 강의(유튜브)](https://youtu.be/5oGAkQsGWkc)
> - [이웅재님의 우아한 타입스크립트 세미나(유튜브)](https://youtu.be/ViS8DLd6o-E)
