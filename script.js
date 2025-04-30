let timerId;
let secends = 0;
let min = 0;
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:5000/generate-sudoku', {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            console.log('Raw response:', response); // لاگ پاسخ خام
            return response.text(); // اول به صورت متن بخونید
        })
        .then(text => {
            console.log('Response text:', text); // متن پاسخ رو لاگ کنید]
            let data;
            try {
                data = JSON.parse(text); // حالا دستی parse کنید
            } catch (e) {
                throw new Error("Filed to parse JSON :" + e.message)
            }

            console.log('Parsed data :', data);
            if (!data.puzzel) {
                throw new Error('No Puzzel key in response');
            }
            const puzzel = data.puzzel;
            const solation = data.solation;
            const table = document.getElementById("A");
            if (!table) {
                throw new Error('Table with id "A" not found');
            }
            table.innerHTML = '';
            //make table
            for (let i = 0; i < 9; i++) {
                const row = document.createElement("tr");
                for (let j = 0; j < 9; j++) {
                    const cell = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = "text";
                    input.maxLength = 1;
                    input.setAttribute("data-row", i);
                    input.setAttribute("data-col", j);
                    input.id = 'inputs';
                    input.value = puzzel[i][j];
                    if (puzzel[i][j] !== 0) {
                        input.value = puzzel[i][j];
                        input.disabled = true;

                    } else {
                        input.value = "";
                    }
                    if (j % 3 === 0) {
                        cell.classList.add('box-left')
                    }
                    if ((j + 1) % 3 === 0) {
                        cell.classList.add('box-right')
                    }
                    if (i % 3 === 0) {
                        cell.classList.add('box-top')
                    }
                    if ((i + 1) % 3 === 0) {
                        cell.classList.add('box-bottom')
                    }
                    cell.appendChild(input);
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }



            //click input 
            table.addEventListener('input', (e) => {
                const row = e.target.getAttribute('data-row');
                const col = e.target.getAttribute('data-col');
                const value = e.target.value;
                if (e.target.tagName === 'INPUT' && !e.target.disabled) {


                    if (value == "" || isNaN(value)) {
                        e.target.style.backgroundColor = 'lightcoral';
                        setTimeout(() => {
                            e.target.value = "";
                            e.target.style.backgroundColor = '';
                        }, 1000);
                        console.log("map")
                        return;
                    }
                    //just number
                    /*  if (!/^[1-9]$/.test(value)) {
                          e.target.style.backgroundColor = 'red';
                          setTimeout(() => {
                              e.target.value = "";
                              e.target.style.backgroundColor = '';
                          }, 1000);

                      }*/
                    //match
                    if (value == solation[row][col]) {
                        e.target.style.backgroundColor = 'lightgreen';
                        setTimeout(() => {
                            e.target.disabled = true;
                            e.target.style.backgroundColor = '';

                        }, 1000);
                    } else {
                        e.target.style.backgroundColor = 'lightyellow';

                        setTimeout(() => {
                            e.target.style.backgroundColor = '';
                            e.target.value = "";
                        }, 1000);
                    }

                }
            })

        })
        .catch(error => {
            console.error('there was problem with fetch operation:', error);
        });
});

function checkEndGame(min) {
    const endMessage = document.getElementById("end-message");
    const lose = document.getElementById("lose");
    const win = document.getElementById("win");
    const inputs = document.querySelectorAll("#inputs");
    const disable = [...inputs].every(input => input.disabled == true);
    const home = document.getElementById("home");
    const result = document.getElementById("result");
    if (!disable && min == 4) {
        clearInterval(timerId);
        home.style.display = 'none';
        result.style.display = 'flex';
        //  document.getElementById("home").style.filter = 'blur(5px)';
        lose.textContent = 'game over';

    } else if (disable) {
        clearInterval(timerId);
        home.style.display = 'none';
        result.style.display = 'flex';
        win.textContent = 'you great done';


    }

}

function startGame() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("home").style.display = "block";
    time();

}

function startAgain() {
    time();
    const result = document.getElementById("result");
    const home = document.getElementById("home");
    result.style.display = 'none';
    home.style.display = 'block';


}

function time() {
    min = 0;
    secends = 0;
    timerId = setInterval(() => {
        let zeroSec;
        let zeroMin;
        if (secends == 59) {
            secends = 0;
            zeroSec = '0';
            min++;
        } else {
            secends++;
        }
        zeroSec = secends < 10 ? '0' : '';
        zeroMin = min < 10 ? '0' : '';
        document.getElementById("timer").innerHTML = `${zeroMin}${min}:${zeroSec}${secends}`;
        checkEndGame(min);
    }, 1000);
}