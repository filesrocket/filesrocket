import assert from 'assert'
import { generateRandomFilename, omitProps } from '../src/utils'

type Sex = 'M' | 'F';

interface User {
  fullname: string;
  age: number;
  sex: Sex;
  country: string;
  github: string;
  twitter: string;
}

describe('Random filename', () => {
  it('Generate filename', () => {
    const FILENAME: string = 'filesrocket.png'
    const filename: string = generateRandomFilename(FILENAME)

    assert.ok(filename !== FILENAME)
    assert.ok(filename.split('-')[0] === FILENAME.replace('.png', ''))
  })
})

describe('Properties', () => {
  it('Remove properties of an object', () => {
    const user: User = {
      fullname: 'Ivan Zaldivar',
      age: 21,
      sex: 'M',
      country: 'El Salvador',
      github: 'https://github.com/IvanZM123',
      twitter: 'https://twitter.com/IvanZM123'
    }

    const newUser: Partial<User> = omitProps(user, ['country', 'sex'])
    assert.notEqual(user, newUser)
  })
})
