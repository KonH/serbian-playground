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
                <td>
                    student
                </td>
                <td>
                    student<label class="form-highlight">i</label> (TODO)
                </td>
                
                <td>
                    ulica
                </td>
                <td>
                    ulic<label class="form-highlight">e</label>
                </td>
                
                <td>
                    slovo
                </td>
                <td>
                    slov<label class="form-highlight">a</label>
                </td>
            </tr>
            <tr>
                <td>
                    stran<label class="form-highlight">a</label>c
                </td>
                <td>
                    stran<label class="form-highlight">ci</label> (TODO)
                </td>
                
                <td>
                    stvar
                </td>
                <td>
                    stvar<label class="form-highlight">i</label>
                </td>

                <td>
                    ime
                </td>
                <td>
                    im<label class="form-highlight">ena</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    učeni<label class="form-highlight">k</label>
                </td>
                <td>
                    učeni<label class="form-highlight">ci</label> (*TODO)
                </td>
                
                <td colspan="2"></td>

                <td>
                    prezime
                </td>
                <td>
                    prezim<label class="form-highlight">ena</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    dialo<label class="form-highlight">g</label>
                </td>
                <td>
                    dialo<label class="form-highlight">zi</label> (*TODO)
                </td>
            </tr>
            <tr>
                <td>
                    ora<label class="form-highlight">h</label>
                </td>
                <td>
                    ora<label class="form-highlight">si</label> (*TODO)
                </td>
            </tr>
            <tr>
                <td>
                    grad
                </td>
                <td>
                    grad<label class="form-highlight">ovi</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    sto
                </td>
                <td>
                    sto<label class="form-highlight">lovi</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    broj
                </td>
                <td>
                    broj<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    detalj
                </td>
                <td>
                    detalj<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    konj
                </td>
                <td>
                    konj<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    kolač
                </td>
                <td>
                    kolač<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    nož
                </td>
                <td>
                    nož<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    miš
                </td>
                <td>
                    miš<label class="form-highlight">evi</label> (**TODO)
                </td>
            </tr>
            <tr>
                <td>
                    džak
                </td>
                <td>
                    dža<label class="form-highlight">ci</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    dan
                </td>
                <td>
                    dan<label class="form-highlight">i</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    komšija
                </td>
                <td>
                    komšij<label class="form-highlight">e</label> (TODO)
                </td>
            </tr>
            <tr>
                <td>
                    turista
                </td>
                <td>
                    turist<label class="form-highlight">i</label> (TODO)
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
  max-width: 700px;
}
.form-highlight {
  color: red;
}
</style>