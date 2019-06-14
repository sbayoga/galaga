<template>
  <div class="home pa3 bg-white">
    <header class="flex items-center justify-start mb5">
      <h3 class="mr3">Terrenos para analizar:</h3>
      <InputNumber style="width: 100px" controls-position="right" v-model="totalGrounds" :min="1"
                   :max="20"></InputNumber>
    </header>
    <section class="body">
      <article v-for="(ground, gKey) in grounds" :key="gKey"
               class="flex items-center justify-start flex-wrap bb mb4 b--black-20 pb4">
        <h3 class="w-100">Terreno #{{gKey + 1}}</h3>
        <header class="w-100 flex items-center justify-start ph3">
          <div class="tl mr3">
            <h4 class="">Número de materiales</h4>
            <InputNumber style="width: 100px" controls-position="right" v-model="grounds[gKey]['materials']" :min="0"
                         :max="5"></InputNumber>
          </div>
          <div class="tl">
            <h4 class="">Coordenadas del terreno</h4>
            <InputNumber style="width: 100px" controls-position="right" v-model="grounds[gKey]['total']" :min="1"
                         :max="20"></InputNumber>
          </div>
        </header>

        <div v-for="(coordenade, cKey) in grounds[gKey]['total']" class="mh3">
          <h5 class="">Coordenada #{{cKey + 1}}</h5>
          <InputNumber style="width: 100px" controls-position="right" v-model="grounds[gKey]['coordenades'][cKey]"
                       :min="0"
                       :max="50"></InputNumber>
        </div>
      </article>
    </section>
    <footer>
      <Button @click="calculate" class="bg-blue white ttu f4 b">Calcular</Button>
    </footer>
    <section class="mt5">
      <h1 class="bb b--black-20 pv3">Resultados</h1>
      <ul v-if="calculateResults" class="list pa0 ma0">
        <li v-for="(result, rKey) in grounds" :key="rKey" class="pv3 bb b--black-05">
          <p class="ma0"><b>Case #{{rKey+1}}</b>: {{result.result.total}} // <i
            class="gray">{{result.result.message}}</i></p>
        </li>
      </ul>
      <p v-else>No hay resultados</p>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {Button, InputNumber} from 'element-ui';

  @Component({
    components: {
      Button,
      InputNumber
    },
  })
  export default class Home extends Vue {
    public calculateResults: boolean = false;
    public totalGrounds: number = 1;
    // public grounds: any[] = [{
    //     total: 4,
    //     coordenades: [2, 1, 0, 1],
    //     materials: 2,
    //     result: {total: 0, message: '', changes: []}
    //   }];
    public grounds: any[] = [{
      total: 10,
      coordenades: [1, 2, 1, 0, 3, 1, 2, 2, 1, 2],
      materials: 1,
      result: {total: 0, message: '', matrix: null}
    }, {
      total: 6,
      coordenades: [2, 1, 4, 3, 0, 2],
      materials: 2,
      result: {total: 0, message: '', changes: []}
    }, {
      total: 3,
      coordenades: [1, 0, 1],
      materials: 4,
      result: {total: 0, message: '', changes: []}
    }, {
      total: 4,
      coordenades: [0, 2, 3, 1],
      materials: 1,
      result: {total: 0, message: '', changes: []}
    }, {
      total: 4,
      coordenades: [2, 1, 0, 1],
      materials: 2,
      result: {total: 0, message: '', changes: []}
    }, {
      total: 10,
      coordenades: [1, 2, 0, 1, 3, 0, 2, 0, 1, 2],
      materials: 3,
      result: {total: 0, message: '', changes: []}
    }, {
      total: 20,
      coordenades: [31, 12, 11, 34, 30, 45, 0, 5, 21, 29, 17, 30, 26, 4, 18, 23, 15, 27, 9, 11],
      materials: 1,
      result: {total: 0, message: '', changes: []}
    }];

    @Watch('totalGrounds') onNewTotalGrounds() {
      this.grounds = this.totalGrounds > this.grounds.length
        ? this.grounds.concat(new Array(this.totalGrounds - this.grounds.length).fill({
          total: 3,
          coordenades: [0, 0, 0],
          materials: 0,
          result: {total: 0, message: '', changes: []}
        }))
        : this.grounds.slice(0, this.totalGrounds);
    }

    public calculate(): void {
      this.calculateResults = false;
      this.grounds.forEach((ground, key) => {
        this.createReservoir(ground.coordenades.slice(), ground.materials, key);
        ground.result.changes = this.lookForChanges(ground.coordenades, ground.result.matrix || []);
        ground.result.message = this.getMessage(ground)
      });
      this.calculateResults = true;
    }

    private lookForChanges(original, custom) {
      const changes = [];
      custom.forEach((custom, index) => {
        if (custom > original[index]) {
          changes.push({position: index + 1, quantity: custom - original[index]})
        }
      });
      return changes;
    }

    private getMessage(ground): string {
      console.log(ground.result.changes)
      const changes = ground.result.changes;
      const option = changes.length === 0 ? 1 : (changes.length === 1 && ground.materials === 2 ? 2 : 3);
      switch (option) {
        case 1:
          return 'No hay manera de embalsar agua';
          break;
        case 2:
          let result = 'Colocando '
          changes.forEach(change => result += `${ change.quantity} en la ${change.position} y `);
          result += `no se ha utilizado el otro`;
          return result;
          break;
        case 3:
          let str = 'Colocando '
          changes.forEach(change => str += `${ change.quantity} en la ${change.position} y `);
          return str.slice(-2) === 'y ' ? str.slice(0, str.length - 3) : str;
          break;
        default :
          return 'No message'
      }
    }

    private createReservoir(matrix, materials, index): void {
      if (materials > 0) {
        for (var i = 0; i < matrix.length; i++) {
          const currentTotal: number = this.grounds[index]['result']['total'],
            waterForThisMatrix: number = this.calculateAllReservedWater(this.createMatrix(this.getMaxFromArray(matrix), matrix.length, matrix));
          waterForThisMatrix >= currentTotal
            ? waterForThisMatrix > 0 ? this.saveWaterAndMatrix(index, matrix) : null
            : this.grounds[index]['result']['total'] = currentTotal;
          matrix[i]++;
          this.createReservoir(matrix, materials - 1, index);
          matrix[i]--;
        }
      } else {
        const currentTotal: number = this.grounds[index]['result']['total'],
        waterForThisMatrix: number = this.calculateAllReservedWater(this.createMatrix(this.getMaxFromArray(matrix), matrix.length, matrix));
      waterForThisMatrix > currentTotal
        ? waterForThisMatrix > 0 ? this.saveWaterAndMatrix(index, matrix) : null
        : this.grounds[index]['result']['total'] = currentTotal
    }
    };

    private saveWaterAndMatrix(index, matrix): void {
      this.grounds[index]['result'].matrix = matrix.slice();
      this.grounds[index]['result'].total = this.calculateAllReservedWater(this.createMatrix(this.getMaxFromArray(matrix), matrix.length, matrix));
    }

    private createMatrix(rows, columns, input): any {
      let matrix = [];
      for (var i = 0; i < rows; i++) {
        matrix[i] = [];
        for (var j = 0; j < columns; j++) {
          matrix[i][j] = this.fillMatrixCell(i, j, input);
        }
      }
      matrix = this.fillWaterBetweenLands(matrix);
      return matrix;
    }

    private fillWaterBetweenLands(matrix): any {
      let tierraIndexs = [];
      for (var k = 0; k < matrix.length; k++) {
        tierraIndexs = [];
        matrix[k].map((e, key) => e === 'T' && tierraIndexs.push(key));
        tierraIndexs.forEach((tierra, key) => tierraIndexs[key + 1] - tierraIndexs[key] > 1 && matrix[k].fill('A', tierraIndexs[key] + 1, tierraIndexs[key + 1] ))
      }
      return matrix
    }

    private calculateAllReservedWater(matrix): number {
      let result = 0;
      matrix.flat().reduce( (acc, cv) => result += (cv === 'A' && 1 || 0))
      return result
    }

    private fillMatrixCell(i, j, input) {
      const max = this.getMaxFromArray(input);
      const index = input[j];
      return i < (max - index) ? 'V' : 'T'
    }

    private getMaxFromArray(array): number {
      let max = 0;
      array.map(e => max = e > max ? e : max);
      return max;
    }
  }
</script>
