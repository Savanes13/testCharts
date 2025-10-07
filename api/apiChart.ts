export const getSalesByDate = async (startDate: string, endDate: string) => {
  try {
    const { data } = await useFetch<{ date: string; categories: Record<string, number> }[]>(
      '/api/sales',
      {
        method: 'post',
        body: { startDate, endDate },
      }
    )
    return data.value
  } catch (error) {
    console.error('Ошибка при получении данных:', error)
    return null
  }
}