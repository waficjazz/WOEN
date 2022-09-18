use wasm_bindgen::prelude::*;
use std::collections::HashMap;


#[wasm_bindgen]
pub fn read_file(a: String) -> String {
    let mut _map: HashMap<&str , Vec<&str>> = HashMap::new();
    a.lines().for_each(|line| {
        let vec: Vec<&str> = line.split(">").collect();
        let key = vec[0].trim();
        let value = vec[1].trim();
        if _map.contains_key(key) {
            let mut vec = _map.get(key).unwrap().to_vec();
            vec.push(value);
            _map.insert(key, vec);
        } else {
            _map.insert(key, vec![value]);
        }
    });

    let mut result = String::new();
    result.push_str("{");
    let mut i:u32 = 0;
    for (key, value) in _map.iter() {
        i = i+1;
        if i < _map.len().try_into().unwrap() {
            result.push_str(&format!("\"{}\":{:?},", key, value));
        }else {
            result.push_str(&format!("\"{}\":{:?}", key, value));
        }
    }
    result.push_str("}");
    result
}