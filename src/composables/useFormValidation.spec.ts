import { describe, expect, it, vi } from 'vitest'

import { isEmail, useFormValidation } from '@/composables/useFormValidation'

const emailError = 'Enter a valid email'

function setup(email = '') {
  return useFormValidation({ email }, (values) =>
    isEmail(values.email) ? {} : { email: emailError },
  )
}

describe('useFormValidation', () => {
  it('hides a field error until that field is touched', () => {
    const { values, errorOf, touch } = setup()

    values.email = 'not-an-email'
    expect(errorOf('email')).toBeUndefined()

    touch('email')
    expect(errorOf('email')).toBe(emailError)
  })

  it('clears the error once the touched field becomes valid', () => {
    const { values, errorOf, touch } = setup('not-an-email')

    touch('email')
    expect(errorOf('email')).toBe(emailError)

    values.email = 'ada@example.com'
    expect(errorOf('email')).toBeUndefined()
  })

  it('does not submit invalid values and shows every field error', async () => {
    const { errorOf, handleSubmit } = setup()
    const onValid = vi.fn()

    await handleSubmit(onValid)()

    expect(onValid).not.toHaveBeenCalled()
    expect(errorOf('email')).toBe(emailError)
  })

  it('submits a copy of the valid values', async () => {
    const { values, handleSubmit } = setup('ada@example.com')
    const onValid = vi.fn()

    await handleSubmit(onValid)()

    expect(onValid).toHaveBeenCalledWith({ email: 'ada@example.com' })

    values.email = 'changed-after-submit@example.com'
    expect(onValid.mock.calls[0]?.[0]).toEqual({ email: 'ada@example.com' })
  })

  it('marks the form as submitting only while the handler is in progress', async () => {
    const { isSubmitting, handleSubmit } = setup('ada@example.com')
    let release: () => void = () => {}
    const pending = new Promise<void>((resolve) => {
      release = resolve
    })

    const submission = handleSubmit(() => pending)()

    expect(isSubmitting.value).toBe(true)
    release()
    await submission
    expect(isSubmitting.value).toBe(false)
  })

  it('resets values and hides errors again', () => {
    const { values, errorOf, touch, reset } = setup()

    values.email = 'not-an-email'
    touch('email')
    expect(errorOf('email')).toBe(emailError)

    reset()

    expect(values.email).toBe('')
    expect(errorOf('email')).toBeUndefined()
  })
})
