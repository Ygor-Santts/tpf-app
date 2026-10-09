<script setup lang="ts">
// "Didn't find your occupation?": adds it to the chosen category, or, with no
// categoryId, asks for a new category too. Emits the occupation once saved.
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import FieldError from '@ui/components/FieldError.vue'
import { useTaxonomyStore } from '@app/stores/taxonomy'
import type { AddedOccupation } from '@infra/services/job.service'
import { useValidation, required, minLength, apiError } from '@shared/validation'

const props = defineProps<{ categoryId?: number | null; open?: boolean }>()
const emit = defineEmits<{ added: [occupation: AddedOccupation]; cancel: [] }>()

const tax = useTaxonomyStore()
const expanded = ref(Boolean(props.open))
const saving = ref(false)
const error = ref('')
const form = reactive({ categoryName: '', name: '' })

const { errors, check, validate, setErrors } = useValidation(form, {
  categoryName: [(v) => (props.categoryId ? '' : required('Informe o nome da categoria.')(v)), minLength(3)],
  name: [required('Informe o nome da profissão.'), minLength(3)],
})

watch(() => props.open, (v) => { if (v) expanded.value = true })
watch(() => props.categoryId, () => { error.value = '' })

function cancel() {
  expanded.value = false
  form.categoryName = ''
  form.name = ''
  error.value = ''
  errors.categoryName = ''
  errors.name = ''
  emit('cancel')
}

async function add() {
  error.value = ''
  if (!(await validate())) return
  saving.value = true
  try {
    const added = await tax.addOccupation(
      props.categoryId
        ? { categoryId: props.categoryId, name: form.name }
        : { categoryName: form.categoryName, name: form.name },
    )
    form.categoryName = ''
    form.name = ''
    expanded.value = false
    emit('added', added)
  } catch (e) {
    const { message, fields } = apiError(e, 'Não foi possível adicionar. Tente novamente.')
    if (Object.keys(fields).length) setErrors(fields)
    else error.value = message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <button
    v-if="!expanded"
    type="button"
    @click="expanded = true"
    class="justify-self-start inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
  >
    <Icon icon="mdi:plus-circle-outline" />Não achou sua profissão? Adicione
  </button>

  <div v-else class="grid gap-3 p-3 rounded-xl border border-dashed border-brand-100 bg-brand-50/40">
    <div v-if="!categoryId">
      <label class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Nova categoria</label>
      <input v-model="form.categoryName" maxlength="60" placeholder="Ex.: Serviços Elétricos" :aria-invalid="!!errors.categoryName" @blur="check('categoryName')" class="w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand" />
      <FieldError :message="errors.categoryName" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Sua profissão</label>
      <input v-model="form.name" maxlength="60" placeholder="Ex.: Eletricista" :aria-invalid="!!errors.name" @blur="check('name')" @keydown.enter.prevent="add" class="w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand" />
      <FieldError :message="errors.name" />
    </div>
    <FieldError :message="error" />
    <div class="flex gap-2">
      <button type="button" @click="cancel" class="flex-1 py-2 rounded-xl border bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
      <button type="button" @click="add" :disabled="saving" class="flex-1 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <Icon v-if="saving" icon="mdi:loading" class="animate-spin" />Adicionar
      </button>
    </div>
  </div>
</template>
