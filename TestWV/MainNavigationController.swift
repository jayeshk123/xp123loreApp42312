//
//  MainNavigationController.swift
//  Xplore-New
//
//  Created by earth on 13/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import RZTransitions

/*extension UINavigationBar {
    open override func sizeThatFits(_ size: CGSize) -> CGSize {
        return CGSize(width: UIScreen.main.bounds.width, height: 60)
    }
}*/

class MainNavigationController: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()
//        let height: CGFloat = 30 //whatever height you want
//        let bounds = self.navigationBar.bounds
//        self.navigationBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: bounds.height + height)
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40 /*55*/))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView

        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
//        //super.viewDidAppear(animated)
//        let height: CGFloat = 20 //whatever height you want
//        let bounds = self.navigationBar.bounds
//        self.navigationBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: bounds.height + height)
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
