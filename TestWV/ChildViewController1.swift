//
//  ChildViewController1.swift
//  TestWV
//
//  Created by earth on 18/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import XLPagerTabStrip

class ChildViewController1: UIViewController, IndicatorInfoProvider {

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return IndicatorInfo(title: "Child 1")
    }
    
}

