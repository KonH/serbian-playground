<template>
    <table class="verb-form-table table table-bordered">
        <thead>
            <tr>
                <th colspan="6">Ja + sam + Srbin.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <b>ja</b>
                </td>
                <td>
                    je<label class="form-highlight">sam</label>
                </td>
                <td>
                    sam
                </td>

                <td>
                    <b>mi</b>
                </td>
                <td>
                    je<label class="form-highlight">smo</label>
                </td>
                <td>
                    smo
                </td>
            </tr>
            <tr>
                <td>
                    <b>ti</b>
                </td>
                <td>
                    je<label class="form-highlight">si</label>
                </td>
                <td>
                    si
                </td>
                
                <td>
                    <b>vi</b>
                </td>
                <td>
                    je<label class="form-highlight">ste</label>
                </td>
                <td>
                    ste
                </td>
            </tr>
            <tr>
                <td>
                    <b>on</b>
                </td>
                <td rowspan="3">
                    <label class="form-highlight">je</label>ste
                </td>
                <td rowspan="3">
                    je
                </td>
                
                <td>
                    <b>oni</b>
                </td>
                <td rowspan="3">
                    je<label class="form-highlight">su</label>
                </td>
                <td rowspan="3">
                    su
                </td>
            </tr>
            <tr>
                <td>
                    <b>ona</b> (ed)
                </td>
                
                <td>
                    <b>one</b>
                </td>
            </tr>
            <tr>
                <td>
                    <b>ono</b>
                </td>
                
                <td>
                    <b>ona</b> (mn)
                </td>
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