export function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// SweetAlert2 dimuat malas agar tidak membebani halaman awal.
const swal = async () => (await import('sweetalert2')).default

export async function showSuccess(text) {
  const Swal = await swal()
  return Swal.fire({ icon: 'success', title: 'Berhasil', text, timer: 1800, showConfirmButton: false })
}

export async function showError(text) {
  const Swal = await swal()
  return Swal.fire({ icon: 'error', title: 'Gagal', text, confirmButtonText: 'Tutup' })
}

export async function confirmDelete(text) {
  const Swal = await swal()
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Hapus artikel?',
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#b91c1c',
  })
  return result.isConfirmed
}
