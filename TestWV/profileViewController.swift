//
//  profileViewController.swift
//  TestWV
//
//  Created by earth on 18/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class profileViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        let layer = UIView(frame: CGRect(x: 46, y: 263, width: 18, height: 33))
        layer.backgroundColor = UIColor.white
        self.view.addSubview(layer)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
