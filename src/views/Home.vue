<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <VDataTable :headers="headers" :items="[{'name': 'pepe'}]"></VDataTable>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
  import {VCard, VDataTable} from 'vuetify/lib';

  @Component({
    components: {
      HelloWorld,
      VCard,
      VDataTable,
    },
  })
  export default class Home extends Vue {
    private input = [];
    private blocks;
    private material;

    created() {
      this.input = [1, 2, 1, 0, 3, 1, 2, 2, 1, 2];
      this.blocks = 10;
      this.materials = 1;
      var matrix = this.createMatrix(this.getMaxMamatrixFrom(this.input), this.input.length);
      var str = ''
      for (var k = 0; k < this.getMaxMamatrixFrom(this.input); k++) {
        for (var l = 0; l < this.input.length; l++) {
          str += matrix[k][l] + ' '
          if (l === this.input.length - 1) {
            str += '\n'
          }
        }
      }
      console.log(str)
      console.log('0 - Vacio | 1 - Tierra | 2 - Agua ')
    }

    public headers = [{
      id: 'id',
      value: 'id',
      align: 'left',
      sortable: true,
    }, {
      id: 'firstName',
      value: 'firstName',
      align: 'left',
      sortable: true,
    }, {
      id: 'lastName',
      value: 'lastName',
      align: 'left',
      sortable: true,
    }, {
      id: 'birthdate',
      value: 'birthdate',
      align: 'left',
      sortable: true,
    }, {
      id: 'happiness',
      value: 'happiness',
      align: 'left',
      sortable: true,
    }, {
      id: 'income',
      value: 'income',
      align: 'left',
      sortable: true,
    }];

    private createMatrix(rows, columns): any {
      let mamatrix = [];
      for (var i = 0; i < rows; i++) {
        mamatrix[i] = [];
        for (var j = 0; j < columns; j++) {
          mamatrix[i][j] = this.fillMamatrixCell(i, j);
        }
      }
      //mamatrix = this.cleanGuater(mamatrix);
      mamatrix = this.buscameUnaTierraQueMeQuiera(mamatrix)
      console.log('Agua embalsada: ' + this.calculateWater(mamatrix) + ' con las coordenadas(cuadrados) ' + this.input)
      return mamatrix;
    }


    private ifUareWaterMyFriend(matrix, i, j): boolean {
      return matrix[i][j + 1] === 1 && matrix[i][j - 1] === 1
    }

    private buscameUnaTierraQueMeQuiera(matrix): any {
      console.error('En busca de tierra shiquillo')
      let tierraIndexs = []
      for (var k = 0; k < matrix.length; k++) {
        tierraIndexs = []
        matrix[k].map((e, key) => e === 'T' && tierraIndexs.push(key));
        console.log('indices de tierra')
        tierraIndexs.forEach((tierra, key) => tierraIndexs[key + 1] - tierraIndexs[key] > 1 && matrix[k].fill('A', tierraIndexs[key] + 1, tierraIndexs[key + 1] ))
        console.log(tierraIndexs)
      }
      console.log(matrix)
      return matrix
    }

    private calculateWater(matrix): number {
      let result = 0;
      matrix.flat().reduce( (acc, cv) => result += (cv === 'A' && 1 || 0))
      return result
    }

    private fillMamatrixCell(i, j) {
      const max = this.getMaxMamatrixFrom(this.input);
      const index = this.input[j];
      if (i < (max - index)) {
        // if (j > 0 && j < this.input.length - 1) {
        //   return 'A' //"agua"
        // } else return 'V' //'vacio';
        return 'V'
      } else return 'T' //'terreno';

    }

    private getMaxMamatrixFrom(array): number {
      let max = 0;
      array.map(e => max = e > max ? e : max);
      return max;
    }
  }
</script>
