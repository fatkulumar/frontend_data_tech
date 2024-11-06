<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }

  input[type=checkbox] {
    display: none;
  }
  
  .container img {
    margin-right: 100px;
    transition: transform 0.25s ease;
    cursor: zoom-in;
  }
  
  input[type=checkbox]:checked ~ label > img {
    transform: scale(5);
    cursor: zoom-out;
  }

  @media only screen and (max-width: 600px) {
    input[type=checkbox]:checked ~ label > img {
      transform: scale(4);
      cursor: zoom-out;
    }
  }
</style>

<script setup>
import { initFlowbite } from "flowbite";
import { ref } from "vue";
import { useAnggotaStore } from "~/composables/useAnggotaStore";
import Swal from "sweetalert2";

// get data dari store/composable
const danggota = useAnggotaStore();
const dataAnggota = ref(danggota.dataAnggota);
// panggil method getAnggota di store anggota
const getAnggota = async () => {
  await danggota.getAnggota()
};

// delete data
async function hanldeDelete(id) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-orangeTheme text-white mx-1 px-2 py-1 ring-2",
      cancelButton: "bg-red-600 text-white mx-1 px-2 py-1 ring-2",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await danggota.deleteAnggota(id);
        getAnggota();
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}


// tambah atau edit data
const handleStore = async () => {
  const resData = await danggota.storeAnggota(form.value);
  const code = resData.code
  // apabila berhasil rubah isi data
  if (code == 200) {
    resetForm();
    // tampilkan Toast
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Success Add",
    });
    // apabila gagal tampilkan Modal Warning
  } else {
    const objectRaw = resData.data.original.data
    
    let html = "";
    Object.entries(objectRaw).forEach(([key, messages]) => {
      html += `<li>${key}: ${messages.join(", ")}</li>`;
    });
    Swal.fire({
      title: `<strong>${resData.message}</u></strong>`,
      icon: "info",
      html: html,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> OK`,
    });
  }
  hideModal();
  getAnggota();
};

// set data lalu untuk menampilkan form edit data
async function handleEdit(data) {
  form.value.id = data.id;
  form.value.nama = data.nama;
  form.value.email = data.email;
  form.value.status = data.status;
  form.value.umur = data.umur;
  showModal();
}

// filtering data by status
async function handleFilterStatus(status) {
  if (status == "aktif" || status == "tidak aktif" ){
    dataAnggota.value = dataAnggota.value.filter(item => item.status == filterStatus.value)
  }else{
    dataAnggota.value = dataAnggota.value
  }
}

  onMounted(() => {
    initFlowbite();
  });

  onBeforeMount(() => {
    getAnggota();
  });

  const form = ref({
    id: "",
    nama: "",
    umur: "",
    status: "",
    email: "",
  });


  let filterStatus = ref("")

  // kosongkan form
  function resetForm() {
    for (const key in form.value) {
      form.value[key] = "";
    }
    getAnggota();
  }

  // untuk menampilkan modal
  function showModal() {
    const $modalElement = document.getElementById("static-modal");
    const modal = new Modal($modalElement);
    modal.show();
  }

  // untuk menghilangkan modal
  function hideModal() {
  const $modalElement = document.getElementById("static-modal");
  const modal = new Modal($modalElement);
  modal.hide();
}

// title di tab
useHead({
  title: "Anggota",
});


</script>


<template>
  <div class="mx-auto container">
    <div class="flex justify-between items-center mt-2">
      <svg @click="showModal" title="tambah" data-modal-toggle="static-modal" data-modal-target="static-modal" class="w-12 h-12 bg-green-400 rounded-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Add_Plus_Circle"> <path id="Vector" d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
      <select
        v-model="filterStatus"
        @change="handleFilterStatus(filterStatus)"
        id="status"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option :selected="form.status === null" value="">Pilih Status</option>
        <option value="aktif">Aktif</option>
        <option value="tidak aktif">Tidak Aktif</option>
      </select>
    </div>
    <div class="relative overflow-x-auto">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Nama</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Umur</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item, index in dataAnggota" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ item.nama }}
            </th>
            <td class="px-6 py-4">{{ item.email }}</td>
            <td class="px-6 py-4">{{ item.umur }}</td>
            <td class="px-6 py-4">{{ item.status }}</td>
            <td class="px-6 py-4 flex gap-1">
              <svg @click="hanldeDelete(item.id)" title="hapus" class="h-6 w-6 bg-green-200 p-1 rounded-md cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

              <svg @click="handleEdit(item)" title="edit" class="h-6 w-6 bg-red-200 p-1 rounded-md cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Main modal -->
    <div
      id="static-modal"
      data-modal-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Anggota
            </h3>
            <button
              @click="hideModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="static-modal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">
            <form @submit.prevent="handleStore" class="max-w-md mx-auto">
              <div class="relative z-0 w-full mb-5 group">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  id="email"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Email</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input
                  v-model="form.nama"
                  type="text"
                  name="nama"
                  id="nama"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="nama"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Nama</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input
                  v-model="form.umur"
                  type="number"
                  name="umur"
                  id="umur"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="umur"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Umur</label
                >
              </div>
              <div>
                <label
                  for="status"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Status</label
                >
                <select
                  v-model="form.status"
                  id="status"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option :selected="form.status === null" value="">Pilih Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
                </select>
              </div>
              <button
              data-modal-hide="static-modal"
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
              Simpan
            </button>
            </form>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              @click="hideModal"
              data-modal-hide="static-modal"
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

