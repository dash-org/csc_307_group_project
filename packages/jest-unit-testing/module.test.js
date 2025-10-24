import mut from './module.js' 

test('div should divide numbers correctly', () => {
  expect(mut.div(10, 2)).toBe(5)
})

test('div by zero should return Infinity', () => {
  expect(mut.div(5, 0)).toBe(Infinity)
})

test('containsNumbers detects numbers in text', () => {
  expect(mut.containsNumbers('abc123')).toBe(true)
})

test('containsNumbers returns false when no numbers', () => {
  expect(mut.containsNumbers('hello')).toBe(false)
})

//does not catches the bug!
test('no numbers: single space', () => {
    expect(mut.containsNumbers(' ')).toBe(false)
  })