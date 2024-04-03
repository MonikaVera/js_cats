export function setCookie(name, value) {
    document.cookie = name + "=" + value + ";" + "path=/";
}


export function getCookie(cname) {
    let name = cname + "="
    //alert(name);
    //tartalmazhatnak specialis karaktereket, ezert dekodolni illik
    let decodedCookie = decodeURIComponent(document.cookie)
    //a cookiek ; -vel elvalasztva vannak tarolva, ezert darabolunk
    let ca = decodedCookie.split(';')
    //a split ad nekunk egy tombot, vegig megyunk rajta
    for (let i = 0; i < ca.length; i++) {        
        let c = ca[i]
        //alert(c);
        //ha spacek vannak, levagjuk oket
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        
        //ha a cookie azzal a nevvel kezdodik, mint amit keresunk
        if (c.indexOf(name) == 0) {
            //alert(c + " " + " name.length: " + name.length + " c.length: " + c.length);
            //alert(c.substring(name.length, c.length));
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

export function deleteCookie(name){
    document.cookie = name + "=" + "" + ";" + "path=/" + "; expires = 0" 
}
