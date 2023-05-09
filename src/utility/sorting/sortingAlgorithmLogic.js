class SortingAlgorithmLogic {
   constructor(size, array, setArray, setIsRunning) {
      this.size = size;
      this.setArray = setArray
      this.setIsRunning = setIsRunning;
      this.array = array;
      this.colors = {
         comparison: "#EAE7B1",
         swap: "#F7D6BF",
         sorted: "#A4BC92",
         unsorted: "#404258"
       };
   }

   // Bubble Sort
   async bubbleSort() {
      let newArray = [...this.array];
      let n = newArray.length;
      let isSorted = false;

      this.setIsRunning(true);
    
      while (!isSorted) {
        isSorted = true;
    
        for (let i = 0; i < n - 1; i++) {
          newArray[i].color = this.colors.comparison;
    
          if (newArray[i].height > newArray[i + 1].height) {
            let temp = newArray[i];
            newArray[i] = newArray[i + 1];
            newArray[i + 1] = temp;

            
    
            isSorted = false;
    
            newArray[i].color = this.colors.swap;
            newArray[i + 1].color = this.colors.swap;
    
            this.setArray([...newArray]);
            await new Promise((resolve) => setTimeout(resolve, 100));
    
            newArray[i].color = this.colors.unsorted;
            newArray[i + 1].color = this.colors.unsorted;
          } else {
            newArray[i].color = this.colors.unsorted;
            newArray[i + 1].color = this.colors.unsorted;
          }
        }
    
        newArray[n - 1].color = this.colors.sorted;
        n--;
    
        this.setArray([...newArray]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    
      for (let i = 0; i < newArray.length; i++) {
        newArray[i].color = this.colors.sorted;
        this.setArray([...newArray]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      this.setIsRunning(false);
    }
    
    
   // Selection Sort
   async selectionSort() {
      let newArray = [...this.array];
      this.setIsRunning(true);

      for(let i = 0; i < newArray.length - 1; i++) {
         let minIndex = i;

         for(let j = i + 1; j < newArray.length; j++) {
            newArray[j].color = this.colors.comparison;
            newArray[minIndex].color = this.colors.comparison;
            this.setArray([...newArray]);

            await new Promise((resolve) => setTimeout(resolve, 300));

            if(newArray[j].height < newArray[minIndex].height) {
               newArray[minIndex].color = this.colors.unsorted;
               minIndex = j;
            }
            newArray[j].color = this.colors.unsorted;
            newArray[minIndex].color = this.colors.unsorted;
            this.setArray([...newArray]);
         }

         let temp = newArray[i];
         newArray[i] = newArray[minIndex];
         newArray[minIndex] = temp;
         this.setArray([...newArray]);
      }

      for (let i = 0; i < newArray.length; i++) {
         newArray[i].color = this.colors.sorted;
         this.setArray([...newArray]);
         await new Promise((resolve) => setTimeout(resolve, 100));
       }


      this.setIsRunning(false);


   }
      
   // Insertion Sort
   async insertionSort() {
      let newArray = [...this.array];
  
      for (let i = 1; i < newArray.length; i++) {
        let j = i - 1;
        let temp = newArray[i];
  
        while (j >= 0 && newArray[j].height > temp.height) {
          newArray[j].color = this.colors.comparison;
          newArray[j + 1] = newArray[j];
          j--;
        }
  
        newArray[j + 1] = temp;
        newArray[j + 1].color = this.colors.sorted;
  
        for (let k = 0; k <= i; k++) {
          if (k !== j + 1) {
            newArray[k].color = this.colors.unsorted;
          }
        }
  
        this.setArray([...newArray]);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
  
      for (let i = 0; i < newArray.length; i++) {
        newArray[i].color = this.colors.sorted;
        this.setArray([...newArray]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  


   // Merge Sort
   async mergeSort() {
      this.setIsRunning(true);
      await this.mergeSortHelper(0, this.array.length - 1);   
      this.setIsRunning(false);
      for (let i = 0; i < this.array.length; i++) {
         this.array[i].color = this.colors.sorted;
       }
       this.setArray([...this.array]);
   }

   async mergeSortHelper(start, end) {
      if (start < end) {
         const mid = Math.floor((start + end) / 2);

         await this.mergeSortHelper(start, mid);

         await this.mergeSortHelper(mid + 1, end);

         await this.merge(start, mid, end);
      }

   }

   async merge(start, mid, end) {
      let tempArray = [];

      let i = start;
      let j = mid + 1;

      while (i <= mid && j <= end) {
         this.array[i].color = this.colors.comparison;
         this.array[j].color = this.colors.comparison;

         this.setArray([...this.array]);

         await new Promise((resolve) => setTimeout(resolve, 100));

         if (this.array[i].height <= this.array[j].height) {
            tempArray.push(this.array[i]);
            i++;
         } else {
            tempArray.push(this.array[j]);
            j++;
         }
      }

      while (i <= mid) {
         tempArray.push(this.array[i]);
         i++;
      }

      while (j <= end) {
         tempArray.push(this.array[j]);
         j++;
      }

      for (let k = start; k <= end; k++) {
         this.array[k] = tempArray[k - start];

         this.array[k].color = this.colors.unsorted;
      }


      this.setArray([...this.array]);
   }


   // Quick Sort
   async quickSort() {
      this.setIsRunning(true);
      await this.quickSortHelper(0, this.array.length - 1);
      
      for (let i = 0; i < this.array.length; i++) {

         this.array[i].color = this.colors.sorted;
         this.setArray([...this.array]);
         await new Promise((resolve) => setTimeout(resolve, 100));
         }

      this.setIsRunning(false)

   }

   async quickSortHelper(start, end) {
      if (start >= end) {
        return;
      }
  
      let pivotIndex = await this.partition(start, end);
  
      await Promise.all([
        this.quickSortHelper(start, pivotIndex - 1),
        this.quickSortHelper(pivotIndex + 1, end),
      ]);

    }
  
    async partition(start, end) {
      let pivotIndex = start;
      let pivotValue = this.array[end].height;
  
      for (let i = start; i < end; i++) {
        this.array[i].color = this.colors.comparison;
        this.setArray([...this.array]);
        await new Promise((resolve) => setTimeout(resolve, 50));
  
        if (this.array[i].height < pivotValue) {
          [this.array[i], this.array[pivotIndex]] = [
            this.array[pivotIndex],
            this.array[i],
          ];
          pivotIndex++;
        }
  
        this.array[i].color = this.colors.unsorted;
        this.setArray([...this.array]);
      }
  
      [this.array[pivotIndex], this.array[end]] = [
        this.array[end],
        this.array[pivotIndex],
      ];
  
      this.array[pivotIndex].color = this.colors.unsorted;
      this.setArray([...this.array]);
      await new Promise((resolve) => setTimeout(resolve, 50));
  
      for (let i = start; i < end; i++) {
        if (i !== pivotIndex) {
          this.array[i].color = this.colors.unsorted;
        }
      }
  
      return pivotIndex;
    }

   // Heap Sort
   async heapSort() {
      let newArray = [...this.array];
      let n = newArray.length;

      this.setIsRunning(true);

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
         await this.heapify(newArray, n, i);
      }

      for (let i = n - 1; i > 0; i--) {
         let temp = newArray[0];
         newArray[0] = newArray[i];
         newArray[i] = temp;

         newArray[i].color = this.colors.sorted;
         this.setArray([...newArray]);

         await this.heapify(newArray, i, 0);
      }

      newArray[0].color = this.colors.sorted;
      this.setArray([...newArray]);

      this.setIsRunning(false);
   }

   async heapify(arr, n, i) {
      let largest = i; // Initialize largest as root
      let l = 2 * i + 1; // left = 2*i + 1
      let r = 2 * i + 2; // right = 2*i + 2

      // If left child is larger than root
      if (l < n && arr[l].height > arr[largest].height)
         largest = l;

      // If right child is larger than largest so far
      if (r < n && arr[r].height > arr[largest].height)
         largest = r;

      // If largest is not root
      if (largest != i) {
         let swap = arr[i];
         arr[i] = arr[largest];
         arr[largest] = swap;

         arr[i].color = this.colors.comparison;
         arr[largest].color = this.colors.comparison;
         this.setArray([...arr]);

         await new Promise((resolve) => setTimeout(resolve, 200));

         arr[i].color = this.colors.unsorted;
         arr[largest].color = this.colors.unsorted;
         this.setArray([...arr]);

         // Recursively heapify the affected sub-tree
         await this.heapify(arr, n, largest);
      }
   }

   // Shell Sort
   async shellSort() {
      let newArray = [...this.array];
      this.setIsRunning(true);
    
      let n = newArray.length;
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i += 1) {
          let temp = newArray[i];
          let j;
          for (j = i; j >= gap && newArray[j - gap].height > temp.height; j -= gap) {
            newArray[j] = newArray[j - gap];
            newArray[j].color = this.colors.comparison;
            this.setArray([...newArray]);
            await new Promise((resolve) => setTimeout(resolve, 100));
            newArray[j].color = this.colors.unsorted;
            this.setArray([...newArray]);
          }
          newArray[j] = temp;
        }
      }

      for (let i = 0; i < newArray.length; i++) {

         newArray[i].color = this.colors.sorted;
         this.setArray([...newArray]);
         await new Promise((resolve) => setTimeout(resolve, 100));
         }

    
      this.setIsRunning(false);
    }
}

export default SortingAlgorithmLogic;