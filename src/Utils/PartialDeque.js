class PartialDeque {
    data;
    front;
    back;
    size; // max supported size

    constructor(n) {
        this.data = Array(n+1);
        this.front = 0;
        this.back = 0;
        this.size = n;
    }

    print() { //Contains a bug
        var i=this.front;
        console.log(`${this.back} ${this.front}`);
        while(i!==this.back-1) {
            console.log(this.data[i]);
            i--;
            if(i<0) i=this.size-1;
        }
        console.log("------")
    }

    push(num) { // Adds to the front 
        this.front++;
        this.front%=this.size;
        this.data[this.front]=num;
    }

    pop() { // Removes last element
        this.back++;
        this.back%=this.size;
    }

    peek() { // Peeks Latest element
        return this.data[this.front];
    }

    includes(num) {
        var i=this.front;
        while(i!==this.back) {
            if(num === this.data[i]) return true;
            i--;
            if(i<0) i=this.size-1;
        }
        return false;
    }

    isEmpty() {
        return this.back>this.front;
    }
}

export default PartialDeque;
//const pd = new PartialDeque(8);

// pd.push(1);
// pd.push(2);
// pd.push(3);
// pd.push(4);
// pd.push(5);

// pd.print();

// pd.pop();
// pd.pop();
// pd.pop();

// pd.print();

// pd.push(6);
// pd.push(7);
// pd.push(8);

// pd.print();

// pd.pop();
// pd.push(9);

// pd.push(10);
// pd.push(11);

// pd.print();
