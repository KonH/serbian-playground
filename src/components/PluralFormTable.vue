<template>
    <table class="verb-form-table table table-bordered">
        <thead>
            <tr>
                <th colspan="2">On - on<label class="form-highlight">i</label></th>
                <th colspan="2">Ona - on<label class="form-highlight">e</label></th>
                <th colspan="2">Ono - on<label class="form-highlight">a</label></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="2">TODO</td>
                
                <td>
                    ulica
                </td>
                <td>
                    ulic<label class="form-highlight">e</label>
                </td>
                
                <td colspan="2">TODO</td>
            </tr>
            <tr>
                <td colspan="2">TODO</td>
                <td colspan="2">TODO</td>
                <td colspan="2">TODO</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VerbFormTable'
});
</script>

<style scoped>
.verb-form-table {
  max-width: 600px;
}
.form-highlight {
  color: red;
}
</style>