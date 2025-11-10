<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr class="text-uppercase text-muted small">
          <th v-if="showCheckbox" style="width: 36px">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="allPageSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th v-for="col in columns" :key="col.key" :class="col.thClass">{{ col.title }}</th>
          <th v-if="$slots['row-actions']" class="text-end"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in items" :key="row[rowKey]">
          <td v-if="showCheckbox">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="isSelected(row)"
              @change="(e)=>onToggle(row, e)"
            />
          </td>
          <td v-for="col in columns" :key="col.key" :class="col.tdClass">
            <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="$slots['row-actions']" class="text-end">
            <slot name="row-actions" :row="row" />
          </td>
        </tr>
        <tr v-if="!loading && items.length === 0">
          <td :colspan="columns.length + (showCheckbox ? 1 : 0) + ($slots['row-actions'] ? 1 : 0)" class="text-center text-muted">
            {{ emptyText || 'Không có dữ liệu' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Column = { key: string; title: string; thClass?: string; tdClass?: string };
const props = defineProps<{
  columns: Column[];
  items: any[];
  rowKey: string;
  loading?: boolean;
  showCheckbox?: boolean;
  selectedIds?: Set<any>;
  emptyText?: string;
}>();

function isSelected(row: any) {
  if (!props.selectedIds) return false;
  return props.selectedIds.has(row[props.rowKey]);
}

const allPageSelected = computed(
  () =>
    !!props.showCheckbox &&
    (props.items?.length || 0) > 0 &&
    props.items.every((r) => (props.selectedIds ? props.selectedIds.has(r[props.rowKey]) : false))
);

function onToggle(row: any, ev: Event) {
  if (!props.selectedIds) return;
  const id = row[props.rowKey];
  const c = (ev.target as HTMLInputElement).checked;
  if (c) props.selectedIds.add(id);
  else props.selectedIds.delete(id);
}
function toggleSelectAll(ev: Event) {
  if (!props.selectedIds) return;
  const c = (ev.target as HTMLInputElement).checked;
  props.items.forEach((r) => (c ? props.selectedIds!.add(r[props.rowKey]) : props.selectedIds!.delete(r[props.rowKey])));
}
</script>

<style scoped>
/* Keep table compact */
</style>

