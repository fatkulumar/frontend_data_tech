// interface data anggota
type Anggota = {
    nama: string,
    email: string,
    umur: number,
    status: string,
}

// membuat store anggota
export const useAnggotaStore = ( () => {

    const dataAnggota = ref<Anggota | null>(null)
    // mengambil data anggota dari database
    async function getAnggota() {
        try {
            // ambil csrf daru backend
            await useApiFetch("/sanctum/csrf-cookie");
            // ambil data
            const { data, error } = await useApiFetch(`/dashboard/anggota`)
            // ambil data dari local storage
            const task = JSON.parse(localStorage.getItem('task'));
            // apabila ada
            if(task) {
                // perbaru variable dataAnggota dari local storage
                dataAnggota.value = task
            }else{
                // apabila tidak ada ambil dari database
                const fetchedData = data.value.data || [];
                dataAnggota.value = fetchedData;
                localStorage.setItem('task', JSON.stringify(fetchedData));
            }
            return data.value
        } catch (error) {
            return error
        }  
    }

    // tambah atau edit data
    async function storeAnggota(info: Anggota) {
        try {
            await useApiFetch("/sanctum/csrf-cookie");
            const { data, error } = await useApiFetch("/dashboard/anggota", {
                method: "POST",
                body: info
            })
            // cek code error data
            if (data._rawValue.code == 200) {
                const task = JSON.parse(localStorage.getItem('task') || '[]');
            
                if (data.value?.data?.id) {
                    const existingTaskIndex = task.findIndex((item: { id: number }) => item.id === data.value.data.id);
    
                    if (existingTaskIndex !== -1) {
                        task[existingTaskIndex] = data.value.data;
                    } else {
                        task.push(data.value.data);
                    }
                } else {
                    task.push(data.value.data); 
                }
    
                localStorage.setItem('task', JSON.stringify(task))
            }

            return data.value
        } catch (error) {
            return error
        }   
    }

    // hapus data 

    async function deleteAnggota(id: string) {
        try {
            await useApiFetch("/sanctum/csrf-cookie");
            const delet = await useApiFetch(`/dashboard/anggota/${id}`, {
                method: "DELETE",
            })
            const task = JSON.parse(localStorage.getItem('task') || '[]');
            const dataTask = task.filter(task => task.id !== id)
            localStorage.setItem('task', JSON.stringify(dataTask));
        } catch (err) {
            console.error(err);
            throw new Error(err.response?.data?.error || 'Something went wrong at delete');
        }   
    }

    return { 
        getAnggota,
        storeAnggota,
        deleteAnggota,
        dataAnggota
    }
  })