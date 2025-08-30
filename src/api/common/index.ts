import request from '@/axios'

// Get all dictionaries
export const getDictApi = () => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/dictionaries` })
}

// Get specific dictionary
export const getDictOneApi = async () => {
  return request.get({ url: `${import.meta.env.VITE_API_BASE_PATH}/dictionaries/one` })
}
